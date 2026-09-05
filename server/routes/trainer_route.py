from flask import Blueprint, request
import bcrypt
import secrets
import string
from flask_jwt_extended import (create_access_token, jwt_required, get_jwt_identity)

from config.database import db
from models.trainer import Trainer

auth = Blueprint("auth",__name__)

def generate_temporary_password(length=10):
    characters = string.ascii_letters + string.digits
    return ''.join(
        secrets.choice(characters)
        for _ in range(length)
    )

def generate_trainer_id():
    last_trainer = Trainer.query.order_by(Trainer.trainer_id.desc()).first()
    if not last_trainer:
        next_number = 0
    else:
        last_number = int(last_trainer.trainer_id[3:])
        next_number = last_number + 1
    if next_number > 999999:
        raise ValueError("Trainer ID limit reached")
    
    return f"TRN{next_number:06d}"

@auth.post("/login")
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return {
            "success": False,
            "message": "Email and password are required"
        }, 400
    
    username = username.strip().lower()
    user = Trainer.query.filter_by(email=username).first()

    if not user:
        return {
            "success": False,
            "message": "Account not found"
        }, 404
    # check status
    if user.status != "Active":
        return {
            "success": False,
            "message": "Account is inactive"
        }, 401
    
    # verify password
    if not bcrypt.checkpw(
        password.encode("utf-8"),
        user.password.encode("utf-8")
    ):
        return {
            "success": False,
            "message": "Invalid Password"
        }, 401
    
    token = create_access_token(identity = user.id)
    
    return {
        "success": True,
        "message": "Login Success",
        "token": token,
        "must_change_password": user.must_change_password,
        "user": {
            "id": user.id,
            "trainer_id": user.trainer_id,
            "fname": user.fname,
            "lname": user.lname,
            "email": user.email,
            "mobile": user.mobile,
            "specialization": user.specialization,
            "status": user.status,
            "role": user.role
        }
    }, 200

@auth.post('/signup')
def signup():
    data = request.get_json()

    fname = data.get("fname")
    lname = data.get("lname")
    email = data.get("email")
    mobile = data.get("mobile")
    specialization = data.get("specialization")
    status = data.get("status","Active")

    fname = fname.strip() if fname else None
    lname = lname.strip() if lname else None
    email = email.strip().lower() if email else None
    mobile = mobile.strip() if mobile else None
    specialization = (
        specialization.strip()
        if specialization
        else None
    )

    if not all([fname, lname, email, mobile, specialization]):
        return {
            "success": False,
            "message": "All Trainer fields are required"
        }, 400

    if status not in ["Active", "Inactive"]:
        return {
            "success": False,
            "message": "Invalid Status"
        }, 400

    existing_email = Trainer.query.filter_by(email=email).first()
    if existing_email:
        return {
            "success": False,
            "message": "Email already registered"
        }, 409
    
    existing_mobile = Trainer.query.filter_by(mobile=mobile).first()
    if existing_mobile:
        return {
            "success": False,
            "message": "Mobile already exist"
        }, 409
    
    try:
        trainer_id = generate_trainer_id()
    except ValueError as error:
        return {
            "success": False,
            "message": str(error)
        }, 500
    
    temporary_password = generate_temporary_password()

    hashed_password = bcrypt.hashpw(
        temporary_password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    trainer = Trainer(
        trainer_id = trainer_id,
        fname = fname,
        lname = lname,
        email = email,
        mobile = mobile,
        specialization = specialization,
        status = status,
        role = "trainer",
        password = hashed_password,
        must_change_password = True
    )

    try:
        db.session.add(trainer)
        db.session.commit()
    except Exception as error:
        db.session.rollback()
        print("Trainer creation error", error)
        return {
            "success": False,
            "message": "Failed to create trainer profile"
        }, 500
    
    return {
        "success": True,
        "message": "Trainer account created successfully",

        "trainer": {
            "id": trainer.id,
            "trainer_id": trainer.trainer_id,
            "fname": trainer.fname,
            "lname": trainer.lname,
            "email": trainer.email,
            "mobile": trainer.mobile,
            "specialization": trainer.specialization,
            "status": trainer.status,
            "role": trainer.role
        },

        "credentials": {
            "trainer_id": trainer.trainer_id,
            "email": trainer.email,
            "temporary_password": temporary_password
        }

    }, 201

@auth.patch("/password/change")
@jwt_required()
def change_password():

    data = request.get_json()

    current_password = data.get("current_password")
    new_password = data.get("new_password")

    if not current_password or not new_password:
        return {
            "success": False,
            "message": "Current password and new password are required"
        }, 400

    if len(new_password) < 8:
        return {
            "success": False,
            "message": "New password must be at least 8 characters"
        }, 400

    id = get_jwt_identity()

    trainer = Trainer.query.get(id)

    if not trainer:
        return {
            "success": False,
            "message": "Trainer account not found"
        }, 404

    if trainer.status != "Active":
        return {
            "success": False,
            "message": "Account is inactive"
        }, 401

    if not bcrypt.checkpw(
        current_password.encode("utf-8"),
        trainer.password.encode("utf-8")
    ):
        return {
            "success": False,
            "message": "Current password is incorrect"
        }, 401

    hashed_password = bcrypt.hashpw(
        new_password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    trainer.password = hashed_password
    trainer.must_change_password = False

    try:
        db.session.commit()
    except Exception as error:
        db.session.rollback()
        print("Password change error:", error)
        return {
            "success": False,
            "message": "Failed to change password"
        }, 500

    return {
        "success": True,
        "message": "Password changed successfully"
    }, 200
from flask import Blueprint, request
# import bcrypt
from flask_jwt_extended import create_access_token

from config.database import db
from models.users import User

auth = Blueprint("auth",__name__)

@auth.post("/login")
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return {
            "success": False,
            "message": "Email/username and password are required"
        }, 400
    
    user = User.query.filter_by(reg_num=username).first()

    if not user:
        return {
            "success": False,
            "message": "Account not found"
        }, 404

    if password != user.reg_num:
        return {
            "success": False,
            "message": "Invalid Password"
        }, 401
    
    token = create_access_token(identity = user.id)
    
    return {
        "success": True,
        "message": "Login Success",
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "reg_num": user.reg_num,
            "role": user.role
        }
    }, 200
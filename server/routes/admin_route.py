from flask import Blueprint, request
import io
import base64
import qrcode
import hashlib
import pyotp
from flask_jwt_extended import (create_access_token, jwt_required, get_jwt_identity)

from config.database import db
from models.admin import Admin

admin_auth = Blueprint("admin_auth", __name__)

@admin_auth.post("/login")
def admin_auth_otp():
    data = request.get_json()

    admin_email = data.get("admin_email")
    otp = data.get("otp")

    if not admin_email or not otp:
        return {
            "success": False,
            "message": "Admin Email and OTP required for authentication"
        }, 400
    
    admin = Admin.query.filter_by(admin_email = admin_email).first()

    if not admin:
        return {
            "success": False,
            "message": "Invalid Admin Email"
        }, 404
    
    totp = pyotp.TOTP(
        admin.totp_secret,
        digits = 8,
        interval = 30,
        digest = hashlib.sha512
    )

    if not totp.verify(otp):
        return {
            "success": False,
            "message": "Invalid OTP"
        }, 401
    
    token = create_access_token(identity = f"admin: {admin.id}")

    return {
        "success": True,
        "message": "Login successfull",
        "token": token,
        "user": {
            "id": admin.id,
            "email": admin.admin_email,
            "role": admin.role
        }
    }, 200

@admin_auth.post("/auth/setup")
def admin_auth_setup():
    data = request.get_json()

    admin_email = data.get("admin_email")

    if not admin_email:
        return {
            "success": False,
            "message": "Email is required"
        }, 400
    
    existing_admin = Admin.query.filter_by(admin_email = admin_email).first()

    if existing_admin:
        return {
            "success": False,
            "message": "this email is already registered"
        }, 409

    secret = pyotp.random_base32()

    admin = Admin(
        admin_email = admin_email,
        totp_secret = secret
    )

    db.session.add(admin)
    db.session.commit()

    totp = pyotp.TOTP(
        secret,
        digits = 8,
        interval = 30,
        digest = hashlib.sha512
    )

    uri = totp.provisioning_uri(
        name = admin_email,
        issuer_name = "AG Report Admin"
    )

    img = qrcode.make(uri)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")

    qr = base64.b64encode(
        buffer.getvalue()
    ).decode("utf-8")

    return {
        "success": True,
        "message": "Authenticator setup generated successfully",
        "email": admin_email,
        "secret": secret,
        "qr": qr,
    }, 201

@admin_auth.post('/auth/setup/verify')
def admin_auth_setup_verify():
    data = request.get_json()

    admin_email = data.get("admin_email")
    otp = data.get("otp")

    if not admin_email or not otp:
        return {
            "success": False,
            "message": "Admin Email and OTP required for authentication"
        }, 400
    
    admin = Admin.query.filter_by(admin_email = admin_email).first()

    if not admin:
        return {
            "success": False,
            "message": "Invalid Admin Email"
        }, 404
    
    totp = pyotp.TOTP(
        admin.totp_secret,
        digits = 8,
        interval = 30,
        digest = hashlib.sha512
    )

    if not totp.verify(otp):
        return {
            "success": False,
            "message": "Invalid OTP"
        }, 401

    return {
        "success": True,
        "message": "Verification successfull",
        "user": {
            "id": admin.id,
            "email": admin.admin_email,
            "role": admin.role
        }
    }, 200

@admin_auth.get('/account/details')
@jwt_required()
def admin_auth_details():
    identity = get_jwt_identity()

    if not identity or not identity.startswith("admin"):
        return {
            "success": False,
            "message": "Invalid authentication token"
        }, 401
    
    try:
        admin_id = int(identity.split(":")[1].strip())
    except (ValueError, IndexError):
        return {
            "success": False,
            "message": "Invalid authentication token"
        }, 401
    
    admin = Admin.query.get(admin_id)

    if not admin:
        return {
            "success": False,
            "message": "Admin account not found"
        }, 404
    
    totp = pyotp.TOTP(
        admin.totp_secret,
        digits=8,
        interval=30,
        digest=hashlib.sha512
    )

    uri = totp.provisioning_uri(
        name=admin.admin_email,
        issuer_name="AG Report Admin"
    )
    
    return {
        "success": True,
        "account": {
            "id": admin.id,
            "email": admin.admin_email,
            "totp": admin.totp_secret,
            "qr_uri": uri
        }
    }, 200

@admin_auth.delete('/delete/account')
@jwt_required()
def admin_auth_delete_account():
    identity = get_jwt_identity()

    if not identity or not identity.startswith("admin"):
        return {
            "success": False,
            "message": "Invalid Authentication Token"
        }, 401
    
    try:
        admin_id = int(identity.split(":")[1].strip())
    except (ValueError, IndexError):
        return {
            "success": False,
            "message": "Invalid Authentication Token"
        }, 401
    
    admin = Admin.query.get(admin_id)

    if not admin:
        return {
            "success": False,
            "message": "Admin account not found"
        }, 404
    
    db.session.delete(admin)
    db.session.commit()

    return {
        "success": True,
        "message": "Admin account deleted successfully"
    }, 200
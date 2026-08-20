from flask import Blueprint, request
import random
import io
import base64
import qrcode
import hashlib
import pyotp
from flask_jwt_extended import create_access_token

from config.database import db
from models.admin import Admin

def generate_id():
    while True:
        admin_id = f"ADM{random.randint(10000, 99999)}"

        exists = Admin.query.filter_by(admin_id = admin_id).first()

        if not exists:
            return admin_id

admin_auth = Blueprint("admin_auth", __name__)

@admin_auth.post("/login")
def admin_auth_otp():
    data = request.get_json()

    admin_id = data.get("admin_id")
    otp = data.get("otp")

    if not admin_id or not otp:
        return {
            "success": False,
            "message": "Admin ID and OTP required for authentication"
        }, 400
    
    admin = Admin.query.filter_by(admin_id = admin_id).first()

    if not admin:
        return {
            "success": False,
            "message": "Invalid Admin ID"
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
            "admin_id": admin.admin_id,
            "role": admin.role
        }
    }, 200

@admin_auth.post("/auth/setup")
def admin_auth_setup():
    admin_id = generate_id()

    secret = pyotp.random_base32()

    admin = Admin(
        admin_id = admin_id,
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
        name = admin_id,
        issuer_name = "AT by Mike Admin"
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
        "admin_id": admin_id,
        "secret": secret,
        "qr": qr,
    }, 201
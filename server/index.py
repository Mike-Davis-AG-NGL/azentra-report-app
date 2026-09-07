from flask import Flask
from flask_cors import CORS
from config.database import db
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
import os
from datetime import timedelta

load_dotenv()

app = Flask(__name__)

CORS(
    app,
    resources={r"/api/*":{"origin":"http://localhost:5173"}}
)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DB_URI")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)

jwt = JWTManager(app)

@jwt.unauthorized_loader
def unauthorized_callback(error):
    print("JWT UNAUTHORIZED:", error)
    return {
        "success": False,
        "message": error
    }, 401


@jwt.invalid_token_loader
def invalid_token_callback(error):
    print("JWT INVALID:", error)
    return {
        "success": False,
        "message": error
    }, 401


@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print("JWT EXPIRED")
    return {
        "success": False,
        "message": "Token has expired"
    }, 401

db.init_app(app)

from models.trainer import Trainer
from models.admin import Admin

with app.app_context():
    db.create_all()

from routes.trainer_route import auth
from routes.admin_route import admin_auth

app.register_blueprint(auth, url_prefix = "/api/auth")
app.register_blueprint(admin_auth, url_prefix = "/api/admin")

@app.route("/")
def home():
    return {"message": "Server Started and running"}

if __name__ == "__main__":
    app.run(debug = True)
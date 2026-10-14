from flask import Flask
from flask_cors import CORS # type: ignore
from config.database import db
from dotenv import load_dotenv # type: ignore
from flask_jwt_extended import JWTManager # type: ignore
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
from models.college import College
from models.department import Department
from models.events import Events
from models.events_session import EventSession

with app.app_context():
    db.create_all()

from routes.trainer_route import auth
from routes.admin_route import admin_auth
from routes.college_route import college_crud
from routes.department_route import department_crud
from routes.event_route import events_crud
from routes.event_session_route import event_sessions_crud

app.register_blueprint(auth, url_prefix = "/api/auth")
app.register_blueprint(admin_auth, url_prefix = "/api/admin")
app.register_blueprint(college_crud, url_prefix = "/api/college")
app.register_blueprint(department_crud, url_prefix = "/api/department")
app.register_blueprint(events_crud, url_prefix = "/api/events")
app.register_blueprint(event_sessions_crud, url_prefix = "/api/events/sessions")

@app.route("/")
def home():
    return {"message": "Server Started and running"}

if __name__ == "__main__":
    app.run(debug = True)
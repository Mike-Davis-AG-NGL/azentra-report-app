from flask import Flask
from flask_cors import CORS
from config.database import db
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
import os

load_dotenv()

app = Flask(__name__)

CORS(
    app,
    resources={r"/api/*":{"origin":"http://localhost:5173"}}
)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DB_URI")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

jwt = JWTManager(app)

db.init_app(app)

from models.users import User
from models.admin import Admin

with app.app_context():
    db.create_all()

from routes.user_route import auth
from routes.admin_route import admin_auth

app.register_blueprint(auth, url_prefix = "/api/auth")
app.register_blueprint(admin_auth, url_prefix = "/api/admin")

@app.route("/")
def home():
    return {"message": "Server Started and running"}

if __name__ == "__main__":
    app.run(debug = True)
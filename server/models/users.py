from config.database import db
from sqlalchemy import Enum

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key = True
    )

    name = db.Column(
        db.String(100),
        nullable = False
    )

    email = db.Column(
        db.String(150),
        nullable = False,
        unique = True
    )

    reg_num = db.Column(
        db.String(12),
        nullable = False,
        unique = True
    )

    role = db.Column(
        Enum("teacher","student", name = "role"),
        nullable = False,
    )
from config.database import db
from sqlalchemy import Enum

class Trainer(db.Model):
    __tablename__ = "trainer"

    id = db.Column(
        db.Integer,
        primary_key = True
    )

    trainer_id = db.Column(
        db.String(10),
        nullable = False,
        unique = True
    )

    fname = db.Column(
        db.String(100),
        nullable = False
    )

    lname = db.Column(
        db.String(100),
        nullable = False
    )

    email = db.Column(
        db.String(150),
        nullable = False,
        unique = True
    )

    mobile = db.Column(
        db.String(15),
        nullable = False,
        unique = True
    )

    specialization = db.Column(
        db.String(120),
        nullable = False
    )

    status = db.Column(
        db.String(10),
        default = "Active",
        nullable = False
    )

    role = db.Column(
        db.String(10),
        default = "trainer",
        nullable = False
    )

    password = db.Column(
        db.String(255),
        nullable = False
    )

    must_change_password = db.Column(
        db.Boolean,
        default = True,
        nullable = False
    )
from datetime import datetime
from config.database import db

class College(db.Model):
    __tablename__ = "college"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    college_name = db.Column(
        db.String(200),
        nullable=False,
        unique=True
    )

    college_code = db.Column(
        db.String(50),
        unique=True,
        nullable=True
    )

    address = db.Column(
        db.Text,
        nullable=True
    )

    city = db.Column(
        db.String(100),
        nullable=True
    )

    state = db.Column(
        db.String(100),
        nullable=True
    )

    contact_person = db.Column(
        db.String(150),
        nullable=True
    )

    contact_email = db.Column(
        db.String(150),
        nullable=True
    )

    contact_mobile = db.Column(
        db.String(20),
        nullable=True
    )

    logo = db.Column(
        db.String(255),
        nullable=True
    )

    status = db.Column(
        db.String(20),
        default="Active",
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    departments = db.relationship(
        "Department",
        back_populates="college",
        cascade="all, delete-orphan"
    )

    events = db.relationship(
        "Events",
        back_populates="college"
    )
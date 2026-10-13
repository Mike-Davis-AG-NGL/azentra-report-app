from datetime import datetime
from config.database import db

class Department(db.Model):
    __tablename__ = "department"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    department_name = db.Column(
        db.String(150),
        nullable=False
    )

    department_code = db.Column(
        db.String(50),
        nullable=True
    )

    college_id = db.Column(
        db.Integer,
        db.ForeignKey("college.id"),
        nullable=False
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

    college = db.relationship(
        "College",
        back_populates="departments"
    )

    events = db.relationship(
        "Events",
        back_populates="department"
    )

    __table_args__ = (
        db.UniqueConstraint(
            "college_id",
            "department_name",
            name="uq_department_college_name"
        ),
    )
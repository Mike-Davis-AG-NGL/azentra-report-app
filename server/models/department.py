from datetime import datetime
from config.database import db

college_department = db.Table(
    "college_department",
    db.Column("college_id", db.Integer, db.ForeignKey("college.id", ondelete="CASCADE"), primary_key=True),
    db.Column("department_id", db.Integer, db.ForeignKey("department.id", ondelete="CASCADE"), primary_key=True)
)

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

    colleges = db.relationship(
        "College",
        secondary=college_department,
        back_populates="departments"
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

    events = db.relationship(
        "Events",
        back_populates="department"
    )

    __table_args__ = (
        db.UniqueConstraint(
            "department_name", 
            name="uq_department_name"
        ),
    )

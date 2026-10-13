from datetime import datetime
from config.database import db

class Events(db.Model):
    __tablename__ = "events"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    event_name = db.Column(
        db.String(200),
        nullable=False
    )

    event_type = db.Column(
        db.String(20),
        nullable=False
    )

    college_id = db.Column(
        db.Integer,
        db.ForeignKey("college.id"),
        nullable=False
    )

    department_id = db.Column(
        db.Integer,
        db.ForeignKey("department.id"),
        nullable=True
    )

    college = db.relationship(
        "College",
        back_populates="events"
    )

    department = db.relationship(
        "Department",
        back_populates="events"
    )

    event_description = db.Column(
        db.Text,
        nullable=True
    )

    start_date = db.Column(
        db.Date,
        nullable=False
    )

    end_date = db.Column(
        db.Date,
        nullable=False
    )

    registration_required = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    event_status = db.Column(
        db.String(20),
        default="Draft",
        nullable=False
    )
    report_status = db.Column(
        db.String(20),
        default="Not Started",
        nullable=False
    )

    created_by = db.Column(
        db.Integer,
        db.ForeignKey("admin.id", ondelete="SET NULL"),
        nullable=True
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
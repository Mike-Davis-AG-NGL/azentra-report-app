from datetime import datetime
from config.database import db

class EventSession(db.Model):
    __tablename__ = "event_sessions"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    event_id = db.Column(
        db.Integer,
        db.ForeignKey("events.id", ondelete="CASCADE"),
        nullable=False
    )

    session_title = db.Column(
        db.String(200),
        nullable=False
    )

    session_details = db.Column(
        db.Text,
        nullable=True
    )

    session_date = db.Column(
        db.Date,
        nullable=False
    )

    start_time = db.Column(
        db.Time,
        nullable=False
    )

    end_time = db.Column(
        db.Time,
        nullable=False
    )

    trainer_id = db.Column(
        db.Integer,
        db.ForeignKey("trainer.id"),
        nullable=False
    )

    session_type = db.Column(db.String(50), nullable=True)

    attendees = db.Column(db.Integer, nullable=True)
    total_students = db.Column(db.Integer, nullable=True)
    tasks_completed = db.Column(db.Integer, nullable=True)
    total_tasks = db.Column(db.Integer, nullable=True)
    active_participants = db.Column(db.Integer, nullable=True)

    engagement_score = db.Column(db.Float, nullable=True)
    attendance_rate = db.Column(db.Float, nullable=True)
    task_completion_rate = db.Column(db.Float, nullable=True)

    top_performers = db.Column(db.Text, nullable=True)
    overall_pass_rate = db.Column(db.Float, nullable=True)
    special_recognition = db.Column(db.Text, nullable=True)
    key_takeaways = db.Column(db.Text, nullable=True)

    event = db.relationship(
        "Events",
        back_populates="sessions"
    )

    trainer = db.relationship(
        "Trainer"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )
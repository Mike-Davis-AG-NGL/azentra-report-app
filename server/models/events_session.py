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
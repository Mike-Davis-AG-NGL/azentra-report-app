from config.database import db
from sqlalchemy.dialects.mysql import LONGTEXT # type: ignore

class SessionPhoto(db.Model):
    __tablename__ = "session_photos"

    id = db.Column(db.Integer, primary_key=True)

    session_id = db.Column(
        db.Integer,
        db.ForeignKey("event_sessions.id", ondelete="CASCADE"),
        nullable=False
    )

    photo_name = db.Column(db.String(255), nullable=False)
    photo_type = db.Column(db.String(100), nullable=False)
    photo_data = db.Column(LONGTEXT, nullable=False)

    session = db.relationship(
        "EventSession",
        backref=db.backref(
            "photo_records",
            cascade="all, delete-orphan"
        )
    )
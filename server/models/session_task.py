from config.database import db

class SessionTask(db.Model):
    __tablename__ = "session_tasks"

    id = db.Column(db.Integer, primary_key=True)

    session_id = db.Column(
        db.Integer,
        db.ForeignKey("event_sessions.id", ondelete="CASCADE"),
        nullable=False
    )

    task_name = db.Column(db.String(200), nullable=True)
    task_details = db.Column(db.Text, nullable=True)
    completion_rate = db.Column(db.Float, nullable=True)
    top_result = db.Column(db.Text, nullable=True)

    session = db.relationship(
        "EventSession",
        backref=db.backref(
            "task_records",
            cascade="all, delete-orphan"
        )
    )
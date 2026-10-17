from datetime import datetime
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError # type: ignore

from config.database import db
from models.events import Events
from models.events_session import EventSession
from models.trainer import Trainer
from models.session_task import SessionTask
from models.session_photo import SessionPhoto

event_sessions_crud = Blueprint("event_sessions_crud", __name__)

def save_session_report(session, data):
    fields = [
        "session_type",
        "attendees",
        "total_students",
        "tasks_completed",
        "total_tasks",
        "active_participants",
        "engagement_score",
        "attendance_rate",
        "task_completion_rate",
        "top_performers",
        "overall_pass_rate",
        "special_recognition",
        "key_takeaways",
    ]

    for field in fields:
        if field in data:
            setattr(session, field, data[field])

    if "tasks" in data:
        if not isinstance(data["tasks"], list):
            raise ValueError("Tasks must be a list")

        session.task_records.clear()

        for task in data["tasks"]:
            if not isinstance(task, dict):
                raise ValueError("Each task must be an object")

            session.task_records.append(
                SessionTask(
                    task_name=task.get("task_name"),
                    task_details=task.get("task_details"),
                    completion_rate=task.get("completion_rate"),
                    top_result=task.get("top_result"),
                )
            )

    # Add newly uploaded photos
    if "session_photos" in data:
        if not isinstance(data["session_photos"], list):
            raise ValueError("Session photos must be a list")

        for photo in data["session_photos"]:
            if not isinstance(photo, dict):
                raise ValueError("Each photo must be an object")

            name = photo.get("name")
            photo_type = photo.get("type")
            photo_data = photo.get("data")

            if not all(
                isinstance(value, str) and value
                for value in (name, photo_type, photo_data)
            ):
                raise ValueError("Photo name, type and data are required")

            session.photo_records.append(
                SessionPhoto(
                    photo_name=name,
                    photo_type=photo_type,
                    photo_data=photo_data,
                )
            )

def session_to_dict(session):
    return {
        "id": session.id,
        "event_id": session.event_id,
        "session_title": session.session_title,
        "session_details": session.session_details,
        "session_date": (
            session.session_date.isoformat()
            if session.session_date else None
        ),
        "start_time": (
            session.start_time.strftime("%H:%M:%S")
            if session.start_time else None
        ),
        "end_time": (
            session.end_time.strftime("%H:%M:%S")
            if session.end_time else None
        ),
        "trainer_id": session.trainer_id,
        "trainer_name": (
            f"{session.trainer.fname} {session.trainer.lname}"
            if session.trainer else None
        ),
        "created_at": (
            session.created_at.isoformat()
            if session.created_at else None
        ),
        "session_type": session.session_type,
        "attendees": session.attendees,
        "total_students": session.total_students,
        "tasks_completed": session.tasks_completed,
        "total_tasks": session.total_tasks,
        "active_participants": session.active_participants,
        "engagement_score": session.engagement_score,
        "attendance_rate": session.attendance_rate,
        "task_completion_rate": session.task_completion_rate,
        "top_performers": session.top_performers,
        "overall_pass_rate": session.overall_pass_rate,
        "special_recognition": session.special_recognition,
        "key_takeaways": session.key_takeaways,

        "tasks": [
            {
                "id": task.id,
                "task_name": task.task_name,
                "task_details": task.task_details,
                "completion_rate": task.completion_rate,
                "top_result": task.top_result,
            }
            for task in session.task_records
        ],

        "session_photos": [
            {
                "id": photo.id,
                "name": photo.photo_name,
                "type": photo.photo_type,
                "data": photo.photo_data,
            }
            for photo in session.photo_records
        ],
    }

def parse_date(value):
    if not isinstance(value, str):
        return None

    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        return None

def parse_time(value):
    if not isinstance(value, str):
        return None

    try:
        return datetime.strptime(value, "%H:%M").time()
    except ValueError:
        try:
            return datetime.strptime(value, "%H:%M:%S").time()
        except ValueError:
            return None

def validate_session(event, session_date, start_time, end_time, trainer_id):
    if not session_date:
        return None, (
            jsonify({
                "message": "Session date is required and must use YYYY-MM-DD format"
            }), 400
        )

    if session_date < event.start_date or session_date > event.end_date:
        return None, (
            jsonify({
                "message": "Session date must be within the event start and end dates"
            }), 400
        )

    if not start_time:
        return None, (
            jsonify({
                "message": "Start time is required and must use HH:MM or HH:MM:SS format"
            }), 400
        )

    if not end_time:
        return None, (
            jsonify({
                "message": "End time is required and must use HH:MM or HH:MM:SS format"
            }), 400
        )

    if end_time <= start_time:
        return None, (
            jsonify({
                "message": "End time must be later than start time"
            }), 400
        )

    if not isinstance(trainer_id, int) or isinstance(trainer_id, bool):
        return None, (
            jsonify({
                "message": "Trainer ID must be an integer"
            }), 400
        )

    trainer = db.session.get(Trainer, trainer_id)

    if not trainer:
        return None, (
            jsonify({
                "message": "Trainer not found"
            }), 404
        )

    return trainer, None


@event_sessions_crud.post("/create/<int:event_id>")
def create_event_session(event_id):
    event = db.session.get(Events, event_id)

    if not event:
        return jsonify({"message": "Event not found"}), 404

    data = request.get_json(silent=True) or {}

    session_title = data.get("session_title")
    session_details = data.get("session_details")
    session_date = parse_date(data.get("session_date"))
    start_time = parse_time(data.get("start_time"))
    end_time = parse_time(data.get("end_time"))
    trainer_id = data.get("trainer_id")

    if not isinstance(session_title, str) or not session_title.strip():
        return jsonify({
            "message": "Session title is required"
        }), 400

    if len(session_title.strip()) > 200:
        return jsonify({
            "message": "Session title cannot exceed 200 characters"
        }), 400

    if session_details is not None and not isinstance(session_details, str):
        return jsonify({
            "message": "Session details must be a string or null"
        }), 400

    trainer, error = validate_session(
        event, session_date, start_time, end_time, trainer_id
    )

    if error:
        return error

    session = EventSession(
        event_id=event.id,
        session_title=session_title.strip(),
        session_details=session_details,
        session_date=session_date,
        start_time=start_time,
        end_time=end_time,
        trainer_id=trainer.id
    )

    try:
        save_session_report(session, data)
        db.session.add(session)
        db.session.commit()

        return jsonify({
            "message": "Event session created successfully",
            "session": session_to_dict(session)
        }), 201
    
    except ValueError as exc:
        db.session.rollback()
        return jsonify({"message": str(exc)}), 400

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "message": "Session could not be created because a referenced record is invalid"
        }), 409


@event_sessions_crud.get("/<int:event_id>")
def get_event_sessions(event_id):
    event = db.session.get(Events, event_id)

    if not event:
        return jsonify({"message": "Event not found"}), 404

    sessions = EventSession.query.filter_by(
        event_id=event_id
    ).order_by(
        EventSession.session_date.asc(),
        EventSession.start_time.asc()
    ).all()

    return jsonify({
        "sessions": [session_to_dict(session) for session in sessions]
    }), 200

@event_sessions_crud.get("/my")
def get_my_event_sessions():
    trainer_id = request.args.get("trainer_id", type=int)

    if not trainer_id:
        return jsonify({
            "message": "Trainer ID is required"
        }), 400

    sessions = EventSession.query.filter_by(
        trainer_id=trainer_id
    ).order_by(
        EventSession.session_date.asc(),
        EventSession.start_time.asc()
    ).all()

    return jsonify({
        "sessions": [session_to_dict(session) for session in sessions]
    }), 200

@event_sessions_crud.get("/s/<int:session_id>")
def get_event_session(session_id):
    session = db.session.get(EventSession, session_id)

    if not session:
        return jsonify({"message": "Event session not found"}), 404

    return jsonify({
        "session": session_to_dict(session)
    }), 200

@event_sessions_crud.patch("/update/<int:session_id>")
def edit_event_session(session_id):
    session = db.session.get(EventSession, session_id)

    if not session:
        return jsonify({"message": "Event session not found"}), 404

    data = request.get_json(silent=True) or {}

    session_title = session.session_title

    if "session_title" in data:
        session_title = data["session_title"]

        if not isinstance(session_title, str) or not session_title.strip():
            return jsonify({
                "message": "Session title cannot be empty"
            }), 400

        if len(session_title.strip()) > 200:
            return jsonify({
                "message": "Session title cannot exceed 200 characters"
            }), 400

        session_title = session_title.strip()

    session_details = session.session_details

    if "session_details" in data:
        session_details = data["session_details"]

        if session_details is not None and not isinstance(session_details, str):
            return jsonify({
                "message": "Session details must be a string or null"
            }), 400

    session_date = session.session_date
    start_time = session.start_time
    end_time = session.end_time
    trainer_id = session.trainer_id

    if "session_date" in data:
        session_date = parse_date(data["session_date"])

    if "start_time" in data:
        start_time = parse_time(data["start_time"])

    if "end_time" in data:
        end_time = parse_time(data["end_time"])

    if "trainer_id" in data:
        trainer_id = data["trainer_id"]

    trainer, error = validate_session(
        session.event,
        session_date,
        start_time,
        end_time,
        trainer_id
    )

    if error:
        return error

    session.session_title = session_title
    session.session_details = session_details
    session.session_date = session_date
    session.start_time = start_time
    session.end_time = end_time
    session.trainer_id = trainer.id

    try:
        save_session_report(session, data)
        db.session.commit()

        return jsonify({
            "message": "Event session updated successfully",
            "session": session_to_dict(session)
        }), 200
    
    except ValueError as exc:
        db.session.rollback()
        return jsonify({"message": str(exc)}), 400

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "message": "Session could not be updated because a referenced record is invalid"
        }), 409

@event_sessions_crud.delete("/delete/<int:session_id>")
def delete_event_session(session_id):
    session = db.session.get(EventSession, session_id)

    if not session:
        return jsonify({"message": "Event session not found"}), 404

    try:
        db.session.delete(session)
        db.session.commit()

        return jsonify({
            "message": "Event session deleted successfully"
        }), 200

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "message": "Event session could not be deleted"
        }), 409

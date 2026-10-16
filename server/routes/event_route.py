from datetime import datetime
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError # type: ignore

from config.database import db
from models.events import Events
from models.college import College
from models.department import Department
from models.trainer import Trainer

events_crud = Blueprint("events_crud", __name__)

def event_to_dict(event):
    return {
        "id": event.id,
        "event_name": event.event_name,
        "event_type": event.event_type,
        "college_id": event.college_id,
        "college_name": event.college.college_name if event.college else None,
        "department_id": event.department_id,
        "department_name": (
            event.department.department_name
            if event.department else None
        ),
        "trainer_id": event.trainer_id,
        "trainer_name": (
            f"{event.trainer.fname} {event.trainer.lname}"
            if event.trainer else None
        ),
        "event_description": event.event_description,
        "start_date": event.start_date.isoformat() if event.start_date else None,
        "end_date": event.end_date.isoformat() if event.end_date else None,
        "registration_required": event.registration_required,
        "event_status": event.event_status,
        "report_status": event.report_status,
        "created_by": event.created_by,
        "created_at": event.created_at.isoformat() if event.created_at else None,
        "updated_at": event.updated_at.isoformat() if event.updated_at else None
    }

def parse_date(value):
    if not isinstance(value, str):
        return None

    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        return None
    
def validate_college_department(college_id, department_id):
    if not isinstance(college_id, int) or isinstance(college_id, bool):
        return None, None, (
            jsonify({"message": "College ID must be an integer"}), 400
        )

    college = db.session.get(College, college_id)

    if not college:
        return None, None, (
            jsonify({"message": "College not found"}), 404
        )

    department = None

    if department_id is not None:
        if not isinstance(department_id, int) or isinstance(department_id, bool):
            return None, None, (
                jsonify({
                    "message": "Department ID must be an integer or null"
                }), 400
            )

        department = db.session.get(Department, department_id)

        if not department:
            return None, None, (
                jsonify({"message": "Department not found"}), 404
            )

        department_college_ids = {
            item.id for item in department.colleges
        }

        if college.id not in department_college_ids:
            return None, None, (
                jsonify({
                    "message": (
                        "The selected department is not associated "
                        "with this college"
                    )
                }), 400
            )

    return college, department, None

@events_crud.post("/create")
def create_event():
    data = request.get_json(silent=True) or {}

    event_name = data.get("event_name")
    event_type = data.get("event_type")
    college_id = data.get("college_id")
    department_id = data.get("department_id")
    trainer_id = data.get("trainer_id")
    start_date = parse_date(data.get("start_date"))
    end_date = parse_date(data.get("end_date"))
    event_description = data.get("event_description")
    registration_required = data.get("registration_required", False)
    event_status = data.get("event_status", "Draft")
    report_status = data.get("report_status", "Not Started")
    created_by = data.get("created_by")

    if not isinstance(event_name, str) or not event_name.strip():
        return jsonify({"message": "Event name is required"}), 400

    if not isinstance(event_type, str) or not event_type.strip():
        return jsonify({"message": "Event type is required"}), 400

    if len(event_type.strip()) > 20:
        return jsonify({"message": "Event type cannot exceed 20 characters"}), 400

    if "college_id" not in data:
        return jsonify({"message": "College ID is required"}), 400

    if department_id == "":
        department_id = None

    if department_id is not None and (
        not isinstance(department_id, int) or isinstance(department_id, bool)
    ):
        return jsonify({"message": "Department ID must be an integer or null"}), 400

    if not start_date:
        return jsonify({
            "message": "Start date is required and must use YYYY-MM-DD format"
        }), 400

    if not end_date:
        return jsonify({
            "message": "End date is required and must use YYYY-MM-DD format"
        }), 400

    if end_date < start_date:
        return jsonify({
            "message": "End date cannot be earlier than start date"
        }), 400

    if not isinstance(registration_required, bool):
        return jsonify({
            "message": "Registration required must be true or false"
        }), 400

    if event_status not in ("Draft", "Published", "Completed", "Cancelled"):
        return jsonify({
            "message": "Event status must be Draft, Published, Completed, or Cancelled"
        }), 400

    if report_status not in ("Not Started", "In Progress", "Completed"):
        return jsonify({
            "message": "Report status must be Not Started, In Progress, or Completed"
        }), 400

    if created_by is not None and (
        not isinstance(created_by, int) or isinstance(created_by, bool)
    ):
        return jsonify({"message": "Created by must be an integer or null"}), 400

    college, department, error = validate_college_department(
        college_id, department_id
    )

    trainer = None

    if trainer_id is not None:
        if not isinstance(trainer_id, int) or isinstance(trainer_id, bool):
            return jsonify({
                "message": "Trainer ID must be an integer or null"
            }), 400

        trainer = db.session.get(Trainer, trainer_id)

        if not trainer:
            return jsonify({"message": "Trainer not found"}), 404

    if error:
        return error

    event = Events(
        event_name=event_name.strip(),
        event_type=event_type.strip(),
        college_id=college.id,
        department_id=department.id if department else None,
        trainer_id=trainer.id if trainer else None,
        event_description=event_description,
        start_date=start_date,
        end_date=end_date,
        registration_required=registration_required,
        event_status=event_status,
        report_status=report_status,
        created_by=created_by
    )

    try:
        db.session.add(event)
        db.session.commit()

        return jsonify({
            "message": "Event created successfully",
            "event": event_to_dict(event)
        }), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "message": "Event could not be created because a referenced record is invalid"
        }), 409
    
@events_crud.get("/")
def get_events():
    college_id = request.args.get("college_id", type=int)
    department_id = request.args.get("department_id", type=int)
    event_status = request.args.get("event_status")
    report_status = request.args.get("report_status")

    query = Events.query

    if college_id is not None:
        query = query.filter_by(college_id=college_id)

    if department_id is not None:
        query = query.filter_by(department_id=department_id)

    if event_status:
        query = query.filter_by(event_status=event_status)

    if report_status:
        query = query.filter_by(report_status=report_status)

    events = query.order_by(Events.id.desc()).all()

    return jsonify({
        "events": [event_to_dict(event) for event in events]
    }), 200

@events_crud.get("/<int:id>")
def get_event_by_id(id):
    event = db.session.get(Events, id)

    if not event:
        return jsonify({"message": "Event not found"}), 404

    return jsonify({"event": event_to_dict(event)}), 200

@events_crud.patch("/update/<int:id>")
def edit_event(id):
    event = db.session.get(Events, id)

    if not event:
        return jsonify({"message": "Event not found"}), 404

    data = request.get_json(silent=True) or {}

    if "event_name" in data:
        name = data["event_name"]

        if not isinstance(name, str) or not name.strip():
            return jsonify({"message": "Event name cannot be empty"}), 400

        event.event_name = name.strip()

    if "event_type" in data:
        event_type = data["event_type"]

        if not isinstance(event_type, str) or not event_type.strip():
            return jsonify({"message": "Event type cannot be empty"}), 400

        if len(event_type.strip()) > 20:
            return jsonify({
                "message": "Event type cannot exceed 20 characters"
            }), 400

        event.event_type = event_type.strip()

    college_id = data.get("college_id", event.college_id)
    department_id = data.get("department_id", event.department_id)

    if "trainer_id" in data:
        trainer_id = data["trainer_id"]

        if trainer_id is None:
            event.trainer_id = None
        else:
            if not isinstance(trainer_id, int) or isinstance(trainer_id, bool):
                return jsonify({
                    "message": "Trainer ID must be an integer or null"
                }), 400

            trainer = db.session.get(Trainer, trainer_id)

            if not trainer:
                return jsonify({"message": "Trainer not found"}), 404

            event.trainer_id = trainer.id

    if department_id == "":
        department_id = None

    if "college_id" in data or "department_id" in data:
        college, department, error = validate_college_department(
            college_id, department_id
        )

        if error:
            return error

        event.college_id = college.id
        event.department_id = department.id if department else None

    if "event_description" in data:
        event.event_description = data["event_description"]

    if "start_date" in data:
        start_date = parse_date(data["start_date"])

        if not start_date:
            return jsonify({
                "message": "Start date must use YYYY-MM-DD format"
            }), 400

        event.start_date = start_date

    if "end_date" in data:
        end_date = parse_date(data["end_date"])

        if not end_date:
            return jsonify({
                "message": "End date must use YYYY-MM-DD format"
            }), 400

        event.end_date = end_date

    if event.end_date < event.start_date:
        return jsonify({
            "message": "End date cannot be earlier than start date"
        }), 400

    if "registration_required" in data:
        if not isinstance(data["registration_required"], bool):
            return jsonify({
                "message": "Registration required must be true or false"
            }), 400

        event.registration_required = data["registration_required"]

    if "event_status" in data:
        if data["event_status"] not in (
            "Draft", "Published", "Completed", "Cancelled"
        ):
            return jsonify({"message": "Invalid event status"}), 400

        event.event_status = data["event_status"]

    if "report_status" in data:
        if data["report_status"] not in (
            "Not Started", "In Progress", "Completed"
        ):
            return jsonify({"message": "Invalid report status"}), 400

        event.report_status = data["report_status"]

    if "created_by" in data:
        created_by = data["created_by"]

        if created_by is not None and (
            not isinstance(created_by, int) or isinstance(created_by, bool)
        ):
            return jsonify({
                "message": "Created by must be an integer or null"
            }), 400

        event.created_by = created_by

    try:
        db.session.commit()

        return jsonify({
            "message": "Event updated successfully",
            "event": event_to_dict(event)
        }), 200

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "message": "Event could not be updated because a referenced record is invalid"
        }), 409
    
@events_crud.delete("/delete/<int:id>")
def delete_event(id):
    event = db.session.get(Events, id)

    if not event:
        return jsonify({"message": "Event not found"}), 404

    try:
        db.session.delete(event)
        db.session.commit()

        return jsonify({
            "message": "Event deleted successfully"
        }), 200

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "message": "Event cannot be deleted because it is referenced by other records"
        }), 409
    
@events_crud.get("/search")
def search_events():
    search_term = request.args.get("q", "").strip()

    if not search_term:
        return jsonify({"message": "Search query is required"}), 400

    events = Events.query.filter(
        Events.event_name.ilike(f"%{search_term}%")
    ).order_by(Events.event_name.asc()).all()

    return jsonify({
        "events": [event_to_dict(event) for event in events]
    }), 200

@events_crud.get("/by-college/<int:college_id>")
def get_events_by_college(college_id):
    college = db.session.get(College, college_id)

    if not college:
        return jsonify({"message": "College not found"}), 404

    events = Events.query.filter_by(
        college_id=college_id
    ).order_by(Events.id.desc()).all()

    return jsonify({
        "events": [event_to_dict(event) for event in events]
    }), 200

@events_crud.get("/by-department/<int:department_id>")
def get_events_by_department(department_id):
    department = db.session.get(Department, department_id)

    if not department:
        return jsonify({"message": "Department not found"}), 404

    events = Events.query.filter_by(
        department_id=department_id
    ).order_by(Events.id.desc()).all()

    return jsonify({
        "events": [event_to_dict(event) for event in events]
    }), 200

@events_crud.get("/active")
def get_active_events():
    events = Events.query.filter_by(
        event_status="Published"
    ).order_by(Events.start_date.asc()).all()

    return jsonify({
        "events": [event_to_dict(event) for event in events]
    }), 200

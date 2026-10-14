from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError # type: ignore

from config.database import db
from models.department import Department
from models.college import College

department_crud = Blueprint("department_crud", __name__)

def department_to_dict(department):
    return {
        "id": department.id,
        "department_name": department.department_name,
        "department_code": department.department_code,
        "college_ids": [college.id for college in department.colleges],
        "college_names": [college.college_name for college in department.colleges],
        "status": department.status,
        "created_at": department.created_at.isoformat() if department.created_at else None
    }

@department_crud.post("/create")
def create_department():
    data = request.get_json(silent=True) or {}

    department_name = data.get("department_name")
    college_ids = data.get("college_ids")
    department_code = data.get("department_code")
    status = data.get("status", "Active")

    if department_code is not None and not isinstance(department_code, str):
        return jsonify({
            "message": "Department code must be a string"
        }), 400

    if not isinstance(department_name, str) or not department_name.strip():
        return jsonify({"message": "Department name is required"}), 400

    if not isinstance(college_ids, list) or not college_ids:
        return jsonify({
            "message": "At least one college must be selected"
        }), 400

    if any(
        not isinstance(college_id, int) or isinstance(college_id, bool)
        for college_id in college_ids
    ):
        return jsonify({
            "message": "College IDs must be integers"
        }), 400

    if len(college_ids) != len(set(college_ids)):
        return jsonify({
            "message": "Duplicate college IDs are not allowed"
        }), 400

    colleges = College.query.filter(
        College.id.in_(college_ids)
    ).all()

    if len(colleges) != len(college_ids):
        return jsonify({
            "message": "One or more colleges were not found"
        }), 404

    if status not in ("Active", "Inactive"):
        return jsonify({"message": "Status must be Active or Inactive"}), 400

    department_code = (
        department_code.strip()
        if department_code
        else None
    )
    department_code = department_code or None

    if department_code:
        existing_code = Department.query.filter_by(
            department_code=department_code
        ).first()

        if existing_code:
            return jsonify({
                "message": "This department code already exists in this college."
            }), 409

    department = Department(
        department_name=department_name.strip(),
        department_code=department_code,
        colleges=colleges,
        status=status
    )

    try:
        db.session.add(department)
        db.session.commit()

        return jsonify({
            "message": "Department created successfully",
            "department": department_to_dict(department)
        }), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "message": "This department already exists in the selected college"
        }), 409

@department_crud.get("/")
def get_departments():
    college_id = request.args.get("college_id", type=int)
    status = request.args.get("status")

    query = Department.query

    if college_id is not None:
        query = query.join(Department.colleges).filter(
            College.id == college_id
        )

    if status:
        if status not in ("Active", "Inactive"):
            return jsonify({"message": "Invalid status"}), 400
        query = query.filter_by(status=status)

    departments = query.order_by(Department.id.desc()).all()

    return jsonify({
        "departments": [
            department_to_dict(department)
            for department in departments
        ]
    }), 200

@department_crud.get("/<int:id>")
def get_department_by_id(id):
    department = db.session.get(Department, id)

    if not department:
        return jsonify({"message": "Department not found"}), 404

    return jsonify({
        "department": department_to_dict(department)
    }), 200

@department_crud.patch("/<int:id>")
def edit_department(id):
    department = db.session.get(Department, id)

    if not department:
        return jsonify({"message": "Department not found"}), 404

    data = request.get_json(silent=True) or {}

    if "department_name" in data:
        name = data["department_name"]

        if not isinstance(name, str) or not name.strip():
            return jsonify({
                "message": "Department name cannot be empty"
            }), 400

        department.department_name = name.strip()

    if "department_code" in data:
        department_code = data["department_code"]

        if department_code is not None and not isinstance(
            department_code, str
        ):
            return jsonify({
                "message": "Department code must be a string"
            }), 400

        department_code = (
            department_code.strip()
            if department_code
            else None
        )

        department.department_code = department_code or None

    if "college_ids" in data:
        college_ids = data["college_ids"]

        if not isinstance(college_ids, list) or not college_ids:
            return jsonify({
                "message": "At least one college must be selected"
            }), 400

        if any(
            not isinstance(college_id, int) or isinstance(college_id, bool)
            for college_id in college_ids
        ):
            return jsonify({
                "message": "College IDs must be integers"
            }), 400

        if len(college_ids) != len(set(college_ids)):
            return jsonify({
                "message": "Duplicate college IDs are not allowed"
            }), 400

        colleges = College.query.filter(
            College.id.in_(college_ids)
        ).all()

        if len(colleges) != len(college_ids):
            return jsonify({
                "message": "One or more colleges were not found"
            }), 404

        department.colleges = colleges

    if "status" in data:
        if data["status"] not in ("Active", "Inactive"):
            return jsonify({"message": "Invalid status"}), 400

        department.status = data["status"]

    if department.department_code:
        existing_code = Department.query.filter(
            Department.department_code == department.department_code,
            Department.id != department.id
        ).first()

        if existing_code:
            return jsonify({
                "message": "This department code already exists in this college"
            }), 409

    try:
        db.session.commit()

        return jsonify({
            "message": "Department updated successfully",
            "department": department_to_dict(department)
        }), 200

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "message": "This department already exists in the selected college"
        }), 409

@department_crud.delete("/<int:id>")
def delete_department(id):
    department = db.session.get(Department, id)

    if not department:
        return jsonify({"message": "Department not found"}), 404

    if department.events:
        return jsonify({
            "message": "Cannot delete a department associated with events"
        }), 409

    try:
        db.session.delete(department)
        db.session.commit()

        return jsonify({
            "message": "Department deleted successfully"
        }), 200

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "message": "Department cannot be deleted because it is referenced by other records"
        }), 409
    
@department_crud.get("/active")
def get_active_departments():
    college_id = request.args.get("college_id", type=int)

    query = Department.query.filter_by(status="Active")

    if college_id is not None:
        query = query.join(Department.colleges).filter(
            College.id == college_id
        )

    departments = query.order_by(Department.department_name.asc()).all()

    return jsonify({
        "departments": [
            department_to_dict(department)
            for department in departments
        ]
    }), 200

@department_crud.get("/search")
def search_departments():
    search_term = request.args.get("q", "").strip()
    college_id = request.args.get("college_id", type=int)

    if not search_term:
        return jsonify({"message": "Search query is required"}), 400

    query = Department.query.filter(
        db.or_(
            Department.department_name.ilike(f"%{search_term}%"),
            Department.department_code.ilike(f"%{search_term}%")
        )
    )

    if college_id is not None:
        query = query.join(Department.colleges).filter(
            College.id == college_id
        )

    departments = query.order_by(Department.department_name.asc()).all()

    return jsonify({
        "departments": [
            department_to_dict(department)
            for department in departments
        ]
    }), 200


@department_crud.get("/check-name")
def check_department_name():
    name = request.args.get("name", "").strip()
    department_id = request.args.get("id", type=int)

    if not name:
        return jsonify({"message": "Department name is required"}), 400

    query = Department.query.filter(
        db.func.lower(Department.department_name) == name.lower()
    )

    if department_id is not None:
        query = query.filter(Department.id != department_id)

    exists = db.session.query(query.exists()).scalar()

    return jsonify({"exists": exists}), 200

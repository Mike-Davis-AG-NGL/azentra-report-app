from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError # type: ignore

from config.database import db
from models.college import College

college_crud = Blueprint("college_crud",__name__)

def college_to_dict(college):
    return {
        "id": college.id,
        "college_name": college.college_name,
        "college_code": college.college_code,
        "address": college.address,
        "city": college.city,
        "state": college.state,
        "contact_person": college.contact_person,
        "contact_email": college.contact_email,
        "contact_mobile": college.contact_mobile,
        "logo": college.logo,
        "status": college.status,
        "created_at": college.created_at.isoformat() if college.created_at else None,
        "updated_at": college.updated_at.isoformat() if college.updated_at else None
    }

@college_crud.post("/create")
def create_college():
    data = request.get_json(silent=True) or {}
    college_name = data.get("college_name")

    if not isinstance(college_name, str) or not college_name.strip():
        return jsonify({"message": "College name is required"}), 400
    
    status = data.get("status", "Active")
    if status not in ("Active", "Inactive"):
        return jsonify({"message": "Status must be Active or Inactive"}), 400
    
    college = College(
        college_name=college_name.strip(),
        college_code=data.get("college_code"),
        address=data.get("address"),
        city=data.get("city"),
        state=data.get("state"),
        contact_person=data.get("contact_person"),
        contact_email=data.get("contact_email"),
        contact_mobile=data.get("contact_mobile"),
        logo=data.get("logo"),
        status=status
    )

    try:
        db.session.add(college)
        db.session.commit()

        return jsonify({
            "message": "College created successfully",
            "college": college_to_dict(college)
        }), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "message": "College name or college code already exists"
        }), 409

@college_crud.get("/")
def get_college():
    colleges = College.query.order_by(College.id.desc()).all()

    return jsonify({
        "colleges": [college_to_dict(college) for college in colleges]
    }), 200

@college_crud.get("/<int:id>")
def get_college_by_id(id):
    college = db.session.get(College, id)

    if not college:
        return jsonify({"message": "College not found"}), 404

    return jsonify({
        "college": college_to_dict(college)
    }), 200

@college_crud.get("/search")
def search_colleges():
    query = request.args.get("q", "").strip()

    if not query:
        return jsonify({"message": "Search query is required"}), 400

    search_term = f"%{query}%"

    colleges = College.query.filter(
        db.or_(
            College.college_name.ilike(search_term),
            College.college_code.ilike(search_term)
        )
    ).order_by(College.college_name.asc()).all()

    return jsonify({
        "colleges": [college_to_dict(college) for college in colleges]
    }), 200

@college_crud.get("/active")
def get_active_colleges():
    colleges = College.query.filter_by(
        status="Active"
    ).order_by(College.college_name.asc()).all()

    return jsonify({
        "colleges": [college_to_dict(college) for college in colleges]
    }), 200

@college_crud.get("/check-name")
def check_college_name():
    name = request.args.get("name", "").strip()
    college_id = request.args.get("id", type=int)

    if not name:
        return jsonify({"message": "College name is required"}), 400

    query = College.query.filter(
        db.func.lower(College.college_name) == name.lower()
    )

    if college_id is not None:
        query = query.filter(College.id != college_id)

    exists = db.session.query(query.exists()).scalar()

    return jsonify({"exists": exists}), 200

@college_crud.get("/check-code")
def check_college_code():
    code = request.args.get("code", "").strip()
    college_id = request.args.get("id", type=int)

    if not code:
        return jsonify({"message": "College code is required"}), 400

    query = College.query.filter(
        db.func.lower(College.college_code) == code.lower()
    )

    if college_id is not None:
        query = query.filter(College.id != college_id)

    exists = db.session.query(query.exists()).scalar()

    return jsonify({"exists": exists}), 200

@college_crud.patch("<int:id>")
def edit_college(id):
    college = db.session.get(College, id)

    if not college:
        return jsonify({"message": "College not found"}), 404

    data = request.get_json(silent=True) or {}

    allowed_fields = [
        "college_name",
        "college_code",
        "address",
        "city",
        "state",
        "contact_person",
        "contact_email",
        "contact_mobile",
        "logo",
        "status"
    ]

    for field in allowed_fields:
        if field in data:
            value = data[field]

            if field == "college_name":
                if not isinstance(value, str) or not value.strip():
                    return jsonify({
                        "message": "College name cannot be empty"
                    }), 400
                value = value.strip()

            if field == "status" and value not in ("Active", "Inactive"):
                return jsonify({
                    "message": "Status must be Active or Inactive"
                }), 400

            setattr(college, field, value)

    try:
        db.session.commit()

        return jsonify({
            "message": "College updated successfully",
            "college": college_to_dict(college)
        }), 200

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "message": "College name or college code already exists"
        }), 409


@college_crud.delete("<int:id>")
def delete_college(id):
    college = db.session.get(College, id)

    if not college:
        return jsonify({"message": "College not found"}), 404

    # Prevent deletion if events or departments reference this college.
    if college.events or college.departments:
        return jsonify({
            "message": "Cannot delete this college because it has associated departments or events"
        }), 409

    try:
        db.session.delete(college)
        db.session.commit()

        return jsonify({
            "message": "College deleted successfully"
        }), 200

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "message": "College cannot be deleted because it is referenced by other records"
        }), 409
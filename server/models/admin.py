from config.database import db

class Admin(db.Model):
    __tablename__ = "admin"

    id = db.Column(
        db.Integer,
        primary_key = True
    )

    role = db.Column(
        db.String(10),
        default = "admin",
        nullable = False
    )

    admin_email = db.Column(
        db.String(150),
        nullable = False,
        unique = True
    )

    totp_secret = db.Column(
        db.String(64),
        unique = True,
        nullable = False
    )
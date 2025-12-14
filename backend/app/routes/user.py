from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User
from ..extensions import db

user_bp = Blueprint("user", __name__)

@user_bp.route("/profile")
@jwt_required()
def profile():
    user = User.query.get(get_jwt_identity())
    return {
        "username": user.username,
        "followers": len(user.followers),
        "following": len(user.following)
    }

@user_bp.route("/follow/<int:user_id>", methods=["POST"])
@jwt_required()
def follow(user_id):
    user = User.query.get(get_jwt_identity())
    target = User.query.get(user_id)

    if target not in user.following:
        user.following.append(target)
        db.session.commit()

    return {"message": "Followed"}

@user_bp.route("/unfollow/<int:user_id>", methods=["POST"])
@jwt_required()
def unfollow(user_id):
    user = User.query.get(get_jwt_identity())
    target = User.query.get(user_id)

    if target in user.following:
        user.following.remove(target)
        db.session.commit()

    return {"message": "Unfollowed"}

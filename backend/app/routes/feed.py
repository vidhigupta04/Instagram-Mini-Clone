from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User, Post

feed_bp = Blueprint("feed", __name__)

@feed_bp.route("/feed")
@jwt_required()
def feed():
    user = User.query.get(get_jwt_identity())
    posts = Post.query.filter(
        Post.user_id.in_([u.id for u in user.following])
    ).order_by(Post.created_at.desc()).all()

    return jsonify([
        {
            "id": p.id,
            "image": p.image_url,
            "caption": p.caption,
            "likes": len(p.likes)
        }
        for p in posts
    ])

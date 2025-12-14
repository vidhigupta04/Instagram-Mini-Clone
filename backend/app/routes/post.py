from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Post, User, Comment
from ..extensions import db

post_bp = Blueprint("post", __name__)

@post_bp.route("/create", methods=["POST"])
@jwt_required()
def create_post():
    data = request.json
    post = Post(
        image_url=data["image_url"],
        caption=data["caption"],
        user_id=get_jwt_identity()
    )
    db.session.add(post)
    db.session.commit()
    return {"message": "Post created"}

@post_bp.route("/like/<int:post_id>", methods=["POST"])
@jwt_required()
def like(post_id):
    user = User.query.get(get_jwt_identity())
    post = Post.query.get(post_id)

    if user in post.likes:
        post.likes.remove(user)
    else:
        post.likes.append(user)

    db.session.commit()
    return {"likes": len(post.likes)}

@post_bp.route("/comment/<int:post_id>", methods=["POST"])
@jwt_required()
def comment(post_id):
    comment = Comment(
        text=request.json["text"],
        user_id=get_jwt_identity(),
        post_id=post_id
    )
    db.session.add(comment)
    db.session.commit()
    return {"message": "Comment added"}

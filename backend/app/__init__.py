from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from .models import db, User, Post, Comment

def create_app():
    app = Flask(__name__)

    # ---------------- CONFIG ----------------
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///insta.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "super-secret-key"

    # 🔥 CORS MUST BE HERE (TOP)
    CORS(
        app,
    resources={r"/*": {"origins": ["http://localhost:5173"]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    db.init_app(app)
    JWTManager(app)

    with app.app_context():
        db.create_all()

    # ---------------- SIGNUP ----------------
    @app.route("/signup", methods=["POST"])
    def signup():
        data = request.json
        user = User(
            username=data["username"],
            email=data["email"],
            password=generate_password_hash(data["password"])
        )
        db.session.add(user)
        db.session.commit()
        return {"message": "User created"}, 201

    # ---------------- LOGIN ----------------
    @app.route("/login", methods=["POST"])
    def login():
        data = request.json
        user = User.query.filter_by(email=data["email"]).first()
        if not user or not check_password_hash(user.password, data["password"]):
            return {"message": "Invalid credentials"}, 401
        token = create_access_token(identity=str(user.id))
        return {"token": token}, 200

    # ---------------- FEED ----------------
    @app.route("/feed", methods=["GET"])
    @jwt_required()
    def feed():
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        posts = Post.query.filter(
            Post.user_id.in_([u.id for u in user.following] + [user_id])
        ).order_by(Post.created_at.desc()).all()

        result = [{
        "id": p.id,
        "image": p.image,
        "caption": p.caption,
        "likes": len(p.liked_by),
        "liked": user in p.liked_by,
        "comments": [
            {"username": User.query.get(c.user_id).username, "comment": c.content}
                for c in Comment.query.filter_by(post_id=p.id).all()
            ]
        } for p in posts]

        return jsonify(result), 200


    # ---------------- CREATE POST ----------------
    @app.route("/posts", methods=["POST"])
    @jwt_required()
    def create_post():
        user = User.query.get(int(get_jwt_identity()))
        data = request.json
        post = Post(
            image=data["image"],
            caption=data.get("caption", ""),
            author=user
        )
        db.session.add(post)
        db.session.commit()
        return {"message": "Post created"}, 201

    # ---------------- LIKE ----------------
    @app.route("/posts/<int:post_id>/like", methods=["POST", "OPTIONS"])    
    @jwt_required()
    def toggle_like(post_id):
        if request.method == "OPTIONS":
            return "", 200
        
        user = User.query.get(int(get_jwt_identity()))
        post = Post.query.get_or_404(post_id)
        if user in post.liked_by:
            post.liked_by.remove(user)
            liked = False
        else:
            post.liked_by.append(user)
            liked = True
        db.session.commit()
        return {"liked": liked, "likes": len(post.liked_by)}, 200

    # ---------------- FOLLOW/UNFOLLOW ----------------
    @app.route("/follow/<int:user_id>", methods=["POST"])
    @jwt_required()
    def follow_unfollow(user_id):
        current_user = User.query.get(int(get_jwt_identity()))
        target_user = User.query.get_or_404(user_id)
        if target_user in current_user.following:
            current_user.following.remove(target_user)
            following = False
        else:
            current_user.following.append(target_user)
            following = True
        db.session.commit()
        return {"following": following, "follower_count": len(target_user.followers)}, 200

    # ---------------- PROFILE ----------------
    @app.route("/profile/<int:user_id>", methods=["GET"])
    @jwt_required()
    def profile(user_id):
        current_user = User.query.get(int(get_jwt_identity()))
        user = User.query.get_or_404(user_id)
        return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "posts": [{"id": p.id, "image": p.image, "caption": p.caption} for p in user.posts],
            "followers": [u.username for u in user.followers],
            "following": [u.username for u in user.following],
            "current_user_id": current_user.id,
            "is_following": user in current_user.following
        })
    

    @app.route("/posts/<int:post_id>/comment", methods=["POST", "OPTIONS"])
    @jwt_required(optional=True)
    def add_comment(post_id):

    # ✅ Handle preflight request
        if request.method == "OPTIONS":
            return "", 200

        user = User.query.get(int(get_jwt_identity()))
        data = request.json

        comment = Comment(
            content=data["comment"],
            post_id=post_id,
            user_id=user.id
        )

        db.session.add(comment)
        db.session.commit()

        return jsonify({
        "username": user.username,
        "comment": comment.content
        }), 201

    return app

import { useState } from "react";
import api from "../api/axios";

export default function PostCard({ post, refresh }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments);

  const toggleLike = async () => {
    try {
      if (liked) {
        await api.post(`/posts/${post.id}/unlike`);
        setLikes(likes - 1);
      } else {
        await api.post(`/posts/${post.id}/like`);
        setLikes(likes + 1);
      }
      setLiked(!liked);
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/posts/${post.id}/comment`, { comment });
      setComments([...comments, res.data]);
      setComment("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="post-card">
      <img src={post.image} alt={post.caption} />
      <div className="content">
        <p>{post.caption}</p>
        <button onClick={toggleLike} className="like-btn">
          {liked ? "♥" : "♡"} {likes} Likes
        </button>
        <div>
          {comments.map((c, idx) => (
            <p key={idx}>
              <strong>{c.username}</strong> {c.comment}
            </p>
          ))}
        </div>
        <form onSubmit={addComment}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
}

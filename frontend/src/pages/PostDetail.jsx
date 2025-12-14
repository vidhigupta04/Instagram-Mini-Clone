import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get("http://127.0.0.1:5000/feed", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPost(res.data.find(p => p.id === parseInt(id)));
    };
    fetchPost();
  }, [id, token]);

  const addComment = async () => {
    const res = await axios.post(
      `http://127.0.0.1:5000/posts/${id}/comment`,
      { comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPost({ ...post, comments: [...post.comments, res.data] });
    setComment("");
  };

  const toggleLike = async () => {
    const res = await axios.post(`http://127.0.0.1:5000/posts/${id}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPost({ ...post, liked: res.data.liked, likes: res.data.likes });
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="post-detail">
      <div className="navbar">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/profile")}>Profile</button>
      </div>
      <img src={post.image} alt={post.caption} />
      <p>{post.caption}</p>
      <button onClick={toggleLike}>{post.liked ? "♥" : "♡"} {post.likes}</button>
      <div className="comments">
        {post.comments.map((c, idx) => (
          <p key={idx}><strong>{c.username}</strong> {c.comment}</p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Add a comment..."
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <button onClick={addComment}>Post</button>
    </div>
  );
};

export default PostDetail;

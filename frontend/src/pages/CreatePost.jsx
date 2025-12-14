import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePost = () => {
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://127.0.0.1:5000/posts",
        { image, caption },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Post created!");
      setImage("");
      setCaption("");
      navigate("/"); // Redirect to Home after post
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    }
  };

  return (
    <div className="home-container">
      {/* Navigation */}
      <div className="page-nav">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/profile")}>Profile</button>
      </div>

      {/* Post Form */}
      <div className="post-card">
        <h2>Create Post</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button className="auth-btn" type="submit">
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = ({ token }) => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://127.0.0.1:5000/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserData(res.data);
        setIsFollowing(res.data.is_following);
      })
      .catch((err) => console.error(err));
  }, [token, userId, navigate]);

  const handleFollow = () => {
    axios
      .post(
        `http://127.0.0.1:5000/follow/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => setIsFollowing(!isFollowing))
      .catch((err) => console.error(err));
  };

  if (!userData) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="page-nav">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/create")}>Create Post</button>
      </div>

      <div className="profile-header">
        <div className="avatar"></div>
        <div>
          <h1>{userData.username}</h1>
          <p>{userData.email}</p>
          <div className="stats">
            <span>Posts: {userData.posts.length}</span>
            <span>Followers: {userData.followers.length}</span>
            <span>Following: {userData.following.length}</span>
          </div>
          {userData.current_user_id !== userData.id && (
            <button onClick={handleFollow}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>

      <div className="profile-posts">
        {userData.posts.map((p) => (
          <img key={p.id} src={p.image} alt={p.caption} />
        ))}
      </div>
    </div>
  );
};

export default Profile;

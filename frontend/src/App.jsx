import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home token={token} />} />
        <Route path="/create" element={<CreatePost token={token} />} />
        {/* Redirect /profile to logged-in user's profile */}
        <Route
          path="/profile"
          element={
            token ? (
              <Navigate to={`/profile/${JSON.parse(atob(token.split(".")[1])).sub}`} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/profile/:userId" element={<Profile token={token} />} />
      </Routes>
    </Router>
  );
}

export default App;

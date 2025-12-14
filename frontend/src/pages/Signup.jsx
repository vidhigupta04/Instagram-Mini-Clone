import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth.css";
import "../styles/background.css";

export default function Signup() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const signup = async () => {
    try {
      await api.post("/signup", data);
      alert("Account created! Please login.");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">Instagram</div>

        <input
          placeholder="Username"
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />
        <input
          placeholder="Email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button className="auth-btn" onClick={signup}>
          Sign Up
        </button>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}

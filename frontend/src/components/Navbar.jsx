import { Link } from "react-router-dom";
import { logout } from "../auth";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/create">Create</Link>
      <Link to="/profile">Profile</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

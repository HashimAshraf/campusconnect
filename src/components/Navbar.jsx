import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/useApp";

export default function Navbar() {
  const { user, logout } = useApp();
  const nav = useNavigate();
  return (
    <header className="nav">
      <div className="container">
        <NavLink to="/" className="brand">CampusConnect</NavLink>
        <NavLink to="/events">Events</NavLink>
        {user?.role === "student" && <NavLink to="/my-events">My events</NavLink>}
        {user?.role === "organizer" && <NavLink to="/organizer">My club</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
        {user ? (
          <>
            <span className="muted">{user.name}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => { logout(); nav("/login"); }}>
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/signup">Sign up</NavLink>
          </>
        )}
      </div>
    </header>
  );
}
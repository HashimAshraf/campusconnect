import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/useApp";

export default function Signup() {
  const { signup } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "", role: "student", club: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (f.password.length < 6) return setError("Password must be at least 6 characters.");
    const err = signup({ ...f, email: f.email.trim() });
    if (err) return setError(err);
    if (f.role === "organizer") setPending(true);
    else nav("/events");
  };

  if (pending)
    return (
      <div className="form">
        <h2>Account created</h2>
        <p>An admin needs to approve your organizer account before you can log in.</p>
        <Link to="/login">Back to log in</Link>
      </div>
    );

  return (
    <form className="form" onSubmit={submit}>
      <h1>Sign up</h1>
      <div>
        <label htmlFor="name">Full name</label>
        <input id="name" autoComplete="name" required value={f.name} onChange={set("name")} />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" required value={f.email} onChange={set("email")} />
      </div>
      <div>
        <label htmlFor="pw">Password</label>
        <input id="pw" type="password" autoComplete="new-password" minLength="6" required value={f.password} onChange={set("password")} />
      </div>
      <div>
        <label htmlFor="role">I am a</label>
        <select id="role" value={f.role} onChange={set("role")}>
          <option value="student">Student</option>
          <option value="organizer">Club organizer</option>
        </select>
      </div>
      {f.role === "organizer" && (
        <div>
          <label htmlFor="club">Club or department</label>
          <input id="club" required value={f.club} onChange={set("club")} />
        </div>
      )}
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn">Create account</button>
      <p className="muted">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}
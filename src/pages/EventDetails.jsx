import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "../context/useApp";

function FeedbackForm({ eventId, existing }) {
  const { addFeedback } = useApp();
  const [rating, setRating] = useState(existing?.rating ?? 5);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [status, setStatus] = useState("");

  function submit(event) {
    event.preventDefault();
    setStatus(addFeedback(eventId, Number(rating), comment) ?? "Feedback saved.");
  }

  return (
    <form className="stack" onSubmit={submit}>
      <h3>{existing ? "Edit your feedback" : "Leave feedback"}</h3>
      <label>Rating
        <select value={rating} onChange={(e) => { setRating(e.target.value); setStatus(""); }}>
          {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} / 5</option>)}
        </select>
      </label>
      <label>Comment
        <textarea rows="3" maxLength="1000" value={comment} onChange={(e) => { setComment(e.target.value); setStatus(""); }} />
      </label>
      <div className="row"><button className="btn">Save feedback</button>{status && <span role="status">{status}</span>}</div>
    </form>
  );
}

export default function EventDetails() {
  const { id } = useParams();
  const app = useApp();
  const event = app.events.find((item) => item.id === id);
  const [message, setMessage] = useState("");
  if (!event) return <div className="panel"><h1>Event not found</h1><Link to="/events">Browse events</Link></div>;

  const registration = app.registrations.find((item) => item.eventId === id && item.userId === app.user?.id);
  const past = app.isPast(event);
  const left = app.seatsLeft(event);
  const reviews = app.feedback.filter((item) => item.eventId === id);

  return (
    <div className="stack">
      <Link to="/events">← All events</Link>
      <article className="panel stack">
        <span className="badge">{event.category}</span>
        <h1>{event.title}</h1>
        <p className="muted">{event.club} · {event.date} · {event.venue}</p>
        {event.poster && <img className="detail-poster" src={event.poster} alt={`Poster for ${event.title}`} />}
        <p className="description">{event.description}</p>
        <div className="row">
          <span className={`badge ${!past && left <= 0 ? "full" : ""}`}>{past ? "Ended" : left > 0 ? `${left} of ${event.capacity} seats left` : "Full"}</span>
          {registration && <span className="badge">{registration.attended ? "Attended" : "Registered"}</span>}
        </div>
        {!past && (
          <div className="row">
            {!app.user && left > 0 && <Link className="btn" to="/login" state={{ returnTo: `/events/${id}` }}>Log in to register</Link>}
            {app.user?.role === "student" && (registration ? (
              <button className="btn btn-ghost" onClick={() => setMessage(app.cancelRegistration(id) ?? "Registration cancelled.")}>Cancel registration</button>
            ) : (
              <button className="btn" disabled={left <= 0} onClick={() => setMessage(app.registerForEvent(id) ?? "You are registered.")}>Register</button>
            ))}
            <span role="status">{message}</span>
          </div>
        )}
      </article>
      <section className="panel stack">
        <h2>Event feedback</h2>
        {app.user?.role === "student" && past && registration?.attended && (
          <FeedbackForm key={`${id}-${app.user.id}`} eventId={id} existing={reviews.find((item) => item.userId === app.user.id)} />
        )}
        {reviews.length ? (
          <ul className="list">{reviews.map((item) => (
            <li key={item.id}><strong>{app.users.find((user) => user.id === item.userId)?.name ?? "Student"}</strong> · {item.rating}/5
              {item.comment && <p className="description">{item.comment}</p>}
            </li>
          ))}</ul>
        ) : <p className="muted">No feedback yet.</p>}
      </section>
    </div>
  );
}

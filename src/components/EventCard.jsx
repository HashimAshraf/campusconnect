import { Link } from "react-router-dom";
import { useApp } from "../context/useApp";
import { catColor } from "../data/mockData";

export default function EventCard({ event }) {
  const { seatsLeft, isPast } = useApp();
  const left = seatsLeft(event);
  const style = event.poster
    ? { backgroundImage: `url(${event.poster})` }
    : { background: catColor[event.category] || "#444" };
  return (
    <Link to={`/events/${event.id}`} className="card">
      <div className="poster" style={style}><span>{event.category}</span></div>
      <div className="card-body">
        <h3>{event.title}</h3>
        <p className="muted">{event.club}</p>
        <p className="muted">{event.date} · {event.venue}</p>
        {isPast(event) ? (
          <span className="badge">Ended</span>
        ) : left <= 0 ? (
          <span className="badge full">Full</span>
        ) : (
          <span className="badge">{left} seats left</span>
        )}
      </div>
    </Link>
  );
}

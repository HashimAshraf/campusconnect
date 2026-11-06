import { Link } from "react-router-dom";
import { useApp } from "../context/useApp";
import EventCard from "../components/EventCard";

export default function MyEvents() {
  const { events, registrations, user, isPast } = useApp();
  const mine = registrations.filter((item) => item.userId === user.id);
  const upcoming = events.filter((event) => !isPast(event) && mine.some((item) => item.eventId === event.id));
  const attended = events.filter((event) => isPast(event) && mine.some((item) => item.eventId === event.id && item.attended));
  upcoming.sort((a, b) => a.date.localeCompare(b.date));
  attended.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="stack">
      <div className="hero"><h1>My events</h1><p>Manage your registrations and revisit events you attended.</p></div>
      <section className="stack">
        <h2>Upcoming registrations</h2>
        {upcoming.length ? <div className="grid">{upcoming.map((event) => <EventCard key={event.id} event={event} />)}</div> :
          <div className="panel">No upcoming registrations. <Link to="/events">Browse events</Link></div>}
      </section>
      <section className="stack">
        <h2>Past events attended</h2>
        {attended.length ? <div className="grid">{attended.map((event) => <EventCard key={event.id} event={event} />)}</div> :
          <div className="panel muted">Attended events will appear here after the organizer records attendance.</div>}
      </section>
    </div>
  );
}

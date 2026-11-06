import { Link, useParams } from "react-router-dom";
import { useApp } from "../context/useApp";

export default function Organizer() {
  const app = useApp();
  const events = app.events.filter((event) => event.organizerId === app.user.id).sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div className="stack">
      <header className="hero">
        <div className="split"><div><h1>Organizer dashboard</h1><p>{app.user.club}</p></div>
          <Link className="btn" to="/organizer/new">Create event</Link>
        </div>
      </header>
      <h2>Your events</h2>
      {!events.length && <p className="panel muted">Create your first event to start accepting registrations.</p>}
      {events.map((event) => (
        <article className="panel split" key={event.id}>
          <div>
            <h3><Link to={`/events/${event.id}`}>{event.title}</Link></h3>
            <p className="muted">{event.date} · {event.venue} · {event.capacity - app.seatsLeft(event)}/{event.capacity} registered</p>
          </div>
          <div className="row">
            <Link className="btn btn-ghost btn-sm" to={`/organizer/${event.id}/attendees`}>Attendees</Link>
            <Link className="btn btn-ghost btn-sm" to={`/organizer/${event.id}/edit`}>Edit</Link>
            <button className="btn btn-danger btn-sm" onClick={() => {
              if (window.confirm(`Delete "${event.title}" and its registrations?`)) app.deleteEvent(event.id);
            }}>Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
}

function csvCell(value) {
  const text = String(value);
  const safe = /^[\s]*[=+@-]|^[\t\r\n]/.test(text) ? "'" + text : text;
  return '"' + safe.replaceAll('"', '""') + '"';
}

function exportAttendees(eventId, attendees) {
  const rows = [["Name", "Email", "Attendance"], ...attendees.map(({ person, attended }) => [
    person.name, person.email, attended ? "Attended" : "Not marked",
  ])];
  const blob = new Blob(["\uFEFF", rows.map((row) => row.map(csvCell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `campusconnect-${eventId}-attendees.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function Attendees() {
  const { id } = useParams();
  const app = useApp();
  const event = app.events.find((item) => item.id === id && item.organizerId === app.user.id);
  if (!event) return <div className="panel"><h1>Event unavailable</h1><Link to="/organizer">Back to dashboard</Link></div>;

  const attendees = app.registrations.filter((item) => item.eventId === id)
    .map((item) => ({ ...item, person: app.users.find((user) => user.id === item.userId) }))
    .filter((item) => item.person);

  return (
    <div className="stack">
      <Link to="/organizer">← Organizer dashboard</Link>
      <header className="hero split">
        <div><h1>{event.title}</h1><p>{attendees.length} registered · {attendees.filter((item) => item.attended).length} attended</p></div>
        <button className="btn" disabled={!attendees.length} onClick={() => exportAttendees(id, attendees)}>Export CSV</button>
      </header>
      <section className="stack">
        <h2>Attendees</h2>
        {attendees.length ? (
          <div className="table-wrap"><table>
            <thead><tr><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Attendance</th></tr></thead>
            <tbody>{attendees.map((item) => (
              <tr key={item.id}>
                <td>{item.person.name}</td><td>{item.person.email}</td>
                <td><label className="check"><input type="checkbox" checked={item.attended} disabled={event.date > app.today}
                  aria-label={`Mark ${item.person.name} as attended`} onChange={(e) => app.markAttendance(item.id, e.target.checked)} /> Attended</label></td>
              </tr>
            ))}</tbody>
          </table></div>
        ) : <p className="panel muted">No registrations yet.</p>}
        {event.date > app.today && attendees.length > 0 && <p className="muted">Attendance can be marked starting on the event date.</p>}
      </section>
    </div>
  );
}

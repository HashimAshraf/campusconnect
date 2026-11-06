import { Link } from "react-router-dom";
import { useApp } from "../context/useApp";

export default function Admin() {
  const { users, events, approveOrganizer, removeUser, deleteEvent } = useApp();
  const pending = users.filter((user) => user.role === "organizer" && !user.approved);

  return (
    <div className="stack">
      <header className="hero"><h1>Admin panel</h1><p>Review organizer requests and manage campus content.</p></header>
      <section className="stack">
        <h2>Organizer approvals <span className="badge">{pending.length} pending</span></h2>
        {pending.length ? pending.map((user) => (
          <article className="panel split" key={user.id}>
            <div><strong>{user.name}</strong><p className="muted">{user.club} · {user.email}</p></div>
            <button className="btn btn-sm" onClick={() => approveOrganizer(user.id)}>Approve organizer</button>
          </article>
        )) : <p className="panel muted">No organizer requests waiting for review.</p>}
      </section>
      <section className="stack">
        <h2>Manage users</h2>
        <div className="table-wrap"><table>
          <thead><tr><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Role</th><th scope="col">Action</th></tr></thead>
          <tbody>{users.map((user) => <tr key={user.id}>
            <td>{user.name}</td><td>{user.email}</td><td className="role">{user.role}{!user.approved && " (pending)"}</td>
            <td>{user.role === "admin" ? "—" : <button className="btn btn-danger btn-sm" aria-label={`Remove ${user.name}`} onClick={() => {
              if (window.confirm(`Remove ${user.name} and their associated records?`)) removeUser(user.id);
            }}>Remove</button>}</td>
          </tr>)}</tbody>
        </table></div>
      </section>
      <section className="stack">
        <h2>Manage events</h2>
        {events.length ? events.map((event) => (
          <article className="panel split" key={event.id}>
            <div><strong><Link to={`/events/${event.id}`}>{event.title}</Link></strong><p className="muted">{event.club} · {event.date}</p></div>
            <button className="btn btn-danger btn-sm" aria-label={`Remove ${event.title}`} onClick={() => {
              if (window.confirm(`Remove "${event.title}" and its registrations?`)) deleteEvent(event.id);
            }}>Remove event</button>
          </article>
        )) : <p className="panel muted">There are no events to moderate.</p>}
      </section>
    </div>
  );
}

import { useState } from "react";
import { useApp } from "../context/useApp";
import EventCard from "../components/EventCard";

export default function Events() {
  const { events, isPast } = useApp();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [club, setClub] = useState("");
  const [from, setFrom] = useState("");
  const filtered = Boolean(q || cat || club || from);
  const cats = [...new Set(events.map((event) => event.category))].sort();
  const clubs = [...new Set(events.map((event) => event.club))].sort();
  const search = q.trim().toLowerCase();
  const list = events
    .filter((event) => `${event.title} ${event.description} ${event.club} ${event.venue}`.toLowerCase().includes(search))
    .filter((event) => !cat || event.category === cat)
    .filter((event) => !club || event.club === club)
    .filter((event) => !from || event.date >= from)
    .sort((a, b) => Number(isPast(a)) - Number(isPast(b)) || (isPast(a) ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));

  function reset() {
    setQ("");
    setCat("");
    setClub("");
    setFrom("");
  }

  return (
    <div className="stack">
      <header className="hero">
        <span className="eyebrow">Campus event directory</span>
        <h1>Discover campus events</h1>
        <p>Find workshops, competitions, and events hosted by university clubs and departments.</p>
      </header>
      <div className="panel filters" aria-label="Event filters">
        <label>Search<input type="search" placeholder="Event, club, or venue" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        <label>Category<select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {cats.map((category) => <option key={category}>{category}</option>)}
        </select></label>
        <label>Club<select value={club} onChange={(e) => setClub(e.target.value)}>
          <option value="">All clubs</option>
          {clubs.map((name) => <option key={name}>{name}</option>)}
        </select></label>
        <label>From date<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
      </div>
      <div className="split">
        <h2>{list.length} {list.length === 1 ? "event" : "events"}</h2>
        {filtered && <button className="btn btn-ghost btn-sm" onClick={reset}>Clear filters</button>}
      </div>
      {list.length ? <div className="grid">{list.map((event) => <EventCard key={event.id} event={event} />)}</div> :
        <p className="panel muted">{filtered ? "No events match these filters." : "No campus events have been published yet."}</p>}
    </div>
  );
}

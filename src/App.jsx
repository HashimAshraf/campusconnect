import { Routes, Route, Link } from "react-router-dom";
import Events from "./pages/Events";

export default function App() {
  return (
    <>
      <header className="nav">
        <nav className="container">
          <Link className="brand" to="/">CampusConnect</Link>
          <Link to="/events">Events</Link>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<Events />} />
          <Route path="*" element={<p>Page not found. <Link to="/">Go home</Link></p>} />
        </Routes>
      </main>
    </>
  );
}

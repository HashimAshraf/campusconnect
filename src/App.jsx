import { Routes, Route, Link } from "react-router-dom";
import Events from "./pages/Events";
import { useApp } from "./context/useApp";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import EventDetails from "./pages/EventDetails";
import MyEvents from "./pages/MyEvents";
const forRole = (role, page) => <ProtectedRoute roles={[role]}>{page}</ProtectedRoute>;
import Organizer, { Attendees } from "./pages/Organizer";
import EventForm from "./pages/EventForm";

export default function App() {
  const { user, logout } = useApp();
  return (
    <>
      <header className="nav">
        <nav className="container">
          <Link className="brand" to="/">CampusConnect</Link>
          <Link to="/events">Events</Link>
          {user?.role === "student" && <Link to="/my-events">My events</Link>}
          {user?.role === "organizer" && <Link to="/organizer">My club</Link>}
          {user ? <button className="btn btn-sm" onClick={logout}>Log out</button> : (
            <><Link to="/login">Log in</Link><Link to="/signup">Sign up</Link></>
          )}
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/my-events" element={forRole("student", <MyEvents />)} />
          <Route path="/organizer" element={forRole("organizer", <Organizer />)} />
          <Route path="/organizer/new" element={forRole("organizer", <EventForm />)} />
          <Route path="/organizer/:id/edit" element={forRole("organizer", <EventForm />)} />
          <Route path="/organizer/:id/attendees" element={forRole("organizer", <Attendees />)} />
          <Route path="*" element={<p>Page not found. <Link to="/">Go home</Link></p>} />
        </Routes>
      </main>
    </>
  );
}

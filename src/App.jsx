import { Routes, Route, Navigate, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import MyEvents from "./pages/MyEvents";
import Organizer, { Attendees } from "./pages/Organizer";
import EventForm from "./pages/EventForm";
import Admin from "./pages/Admin";

const forRole = (role, page) => <ProtectedRoute roles={[role]}>{page}</ProtectedRoute>;

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/my-events" element={forRole("student", <MyEvents />)} />
          <Route path="/organizer" element={forRole("organizer", <Organizer />)} />
          <Route path="/organizer/new" element={forRole("organizer", <EventForm />)} />
          <Route path="/organizer/:id/edit" element={forRole("organizer", <EventForm />)} />
          <Route path="/organizer/:id/attendees" element={forRole("organizer", <Attendees />)} />
          <Route path="/admin" element={forRole("admin", <Admin />)} />
          <Route path="*" element={<div className="panel"><h1>Page not found</h1><Link to="/events">Browse events</Link></div>} />
        </Routes>
      </main>
    </>
  );
}

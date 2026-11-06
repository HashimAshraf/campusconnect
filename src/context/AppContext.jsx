import { useState } from "react";
import { seed } from "../data/mockData";

import { AppContext } from "./useApp";

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem("cc_db"));
    if (saved && ["users", "events", "registrations", "feedback"].every((key) => Array.isArray(saved[key]))) {
      return saved;
    }
  } catch {
    // Start with the demo data if the browser cannot read the saved copy.
  }
  return seed;
}

const uid = () => crypto.randomUUID();
const normalizeEmail = (email) => email.trim().toLowerCase();

export function AppProvider({ children }) {
  const [db, setDb] = useState(load);
  const [userId, setUserId] = useState(() => localStorage.getItem("cc_user"));
  const user = db.users.find((item) => item.id === userId && item.approved) ?? null;
  const [today] = useState(() => new Date().toLocaleDateString("sv-SE"));
  const isPast = (event) => event.date < today;
  const entries = (eventId) => db.registrations.filter((item) => item.eventId === eventId);
  const seatsLeft = (event) => Math.max(0, event.capacity - entries(event.id).length);
  const findEvent = (id) => db.events.find((item) => item.id === id);
  const owns = (event) => user?.role === "organizer" && event?.organizerId === user.id;

  function save(next) {
    try {
      localStorage.setItem("cc_db", JSON.stringify(next));
    } catch {
      return "Browser storage could not save the changes. If you added a poster, try a smaller image.";
    }
    setDb(next);
    return null;
  }

  const update = (key, items) => save({ ...db, [key]: items });

  function setSession(id) {
    if (id) localStorage.setItem("cc_user", id);
    else localStorage.removeItem("cc_user");
    setUserId(id);
  }

  function login(email, password) {
    const account = db.users.find((item) => normalizeEmail(item.email) === normalizeEmail(email) && item.password === password);
    if (!account) return { error: "Wrong email or password." };
    if (!account.approved) return { error: "Your organizer account is waiting for admin approval." };
    setSession(account.id);
    return { user: account };
  }

  function signup({ name, email, password, role, club }) {
    if (!["student", "organizer"].includes(role) || !name.trim() || (role === "organizer" && !club.trim())) {
      return "Enter a name and, for organizers, a club or department.";
    }
    if (db.users.some((item) => normalizeEmail(item.email) === normalizeEmail(email))) {
      return "An account with this email already exists.";
    }
    const account = {
      id: uid(), name: name.trim(), email: normalizeEmail(email), password, role,
      club: role === "organizer" ? club.trim() : "", approved: role === "student",
    };
    const error = update("users", [...db.users, account]);
    if (!error && account.approved) setSession(account.id);
    return error;
  }

  function registerForEvent(eventId) {
    const event = findEvent(eventId);
    if (user?.role !== "student") return "Log in as a student to register.";
    if (!event || isPast(event)) return "Registration has ended.";
    if (entries(eventId).some((item) => item.userId === user.id)) return "You are already registered.";
    if (seatsLeft(event) <= 0) return "This event is full.";
    return update("registrations", [...db.registrations, { id: uid(), eventId, userId: user.id, attended: false }]);
  }

  function cancelRegistration(eventId) {
    const event = findEvent(eventId);
    if (user?.role !== "student" || !event || isPast(event)) return "This registration can no longer be cancelled.";
    return update("registrations", db.registrations.filter((item) => !(item.eventId === eventId && item.userId === user.id)));
  }

  function markAttendance(regId, attended) {
    const registration = db.registrations.find((item) => item.id === regId);
    const event = findEvent(registration?.eventId);
    if (!owns(event) || event.date > today) return "Attendance is unavailable.";
    return update("registrations", db.registrations.map((item) => item.id === regId ? { ...item, attended } : item));
  }

  function addFeedback(eventId, rating, comment) {
    const event = findEvent(eventId);
    if (user?.role !== "student" || !event || !isPast(event) ||
        !entries(eventId).some((item) => item.userId === user.id && item.attended)) {
      return "Feedback is available after you attend an event.";
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return "Choose a rating from 1 to 5.";
    const previous = db.feedback.find((item) => item.eventId === eventId && item.userId === user.id);
    return update("feedback", [
      ...db.feedback.filter((item) => item.id !== previous?.id),
      { id: previous?.id ?? uid(), eventId, userId: user.id, rating, comment: comment.trim() },
    ]);
  }

  function createEvent(data) {
    if (user?.role !== "organizer") return "Only organizers can publish events.";
    return update("events", [...db.events, { ...data, id: uid(), organizerId: user.id, club: user.club }]);
  }

  function updateEvent(id, data) {
    if (!owns(findEvent(id))) return "You can only edit your club’s events.";
    if (data.capacity < entries(id).length) return "Capacity cannot be less than the number registered.";
    return update("events", db.events.map((event) => event.id === id ? { ...event, ...data } : event));
  }

  function deleteEvent(id) {
    if (user?.role !== "admin" && !owns(findEvent(id))) return "You do not have access to remove this event.";
    return save({
      ...db,
      events: db.events.filter((event) => event.id !== id),
      registrations: db.registrations.filter((item) => item.eventId !== id),
      feedback: db.feedback.filter((item) => item.eventId !== id),
    });
  }

  function approveOrganizer(id) {
    if (user?.role !== "admin") return "Only admins can approve organizers.";
    return update("users", db.users.map((item) => item.id === id && item.role === "organizer" ? { ...item, approved: true } : item));
  }

  function removeUser(id) {
    if (user?.role !== "admin" || db.users.find((item) => item.id === id)?.role === "admin") {
      return "This account cannot be removed.";
    }
    const removed = new Set(db.events.filter((event) => event.organizerId === id).map((event) => event.id));
    return save({
      users: db.users.filter((item) => item.id !== id),
      events: db.events.filter((event) => !removed.has(event.id)),
      registrations: db.registrations.filter((item) => item.userId !== id && !removed.has(item.eventId)),
      feedback: db.feedback.filter((item) => item.userId !== id && !removed.has(item.eventId)),
    });
  }

  const value = {
    ...db, user, today, isPast, seatsLeft,
    login, signup, logout: () => setSession(null),
    registerForEvent, cancelRegistration, markAttendance,
    addFeedback, createEvent, updateEvent, deleteEvent,
    approveOrganizer, removeUser,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

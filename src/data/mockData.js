export const catColor = {
  Tech: "#0f6b5c",
  Workshop: "#2f5d8a",
  Cultural: "#7a3e6b",
  Career: "#5b6b2f",
  Sports: "#8a6d1d",
};

function demoDate(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString("sv-SE");
}

export const seed = {
  users: [
    { id: "a1", name: "Admin", email: "admin@campus.edu", password: "admin123", role: "admin", approved: true, club: "" },
    { id: "o1", name: "Sara Khan", email: "org@campus.edu", password: "org123", role: "organizer", approved: true, club: "Computing Society" },
    { id: "o2", name: "Bilal Ahmed", email: "drama@campus.edu", password: "org123", role: "organizer", approved: true, club: "Drama Club" },
    { id: "o3", name: "Hina Malik", email: "sports@campus.edu", password: "org123", role: "organizer", approved: false, club: "Sports Committee" },
    { id: "s1", name: "Ali Raza", email: "stu@campus.edu", password: "stu123", role: "student", approved: true, club: "" },
    { id: "s2", name: "Ayesha Noor", email: "ayesha@campus.edu", password: "stu123", role: "student", approved: true, club: "" },
    { id: "s3", name: "Usman Tariq", email: "usman@campus.edu", password: "stu123", role: "student", approved: true, club: "" },
  ],
  events: [
    { id: "e1", title: "Hackathon 24", description: "A 24-hour team hackathon. Build anything that helps campus life.", category: "Tech", date: demoDate(13), venue: "Main Auditorium", capacity: 50, club: "Computing Society", organizerId: "o1", poster: "" },
    { id: "e2", title: "Intro to React Workshop", description: "Hands-on session covering components, props and state.", category: "Workshop", date: demoDate(7), venue: "CS Lab 2", capacity: 2, club: "Computing Society", organizerId: "o1", poster: "" },
    { id: "e3", title: "Annual Drama Night", description: "An evening of short plays written and performed by students.", category: "Cultural", date: demoDate(28), venue: "Open-Air Theatre", capacity: 200, club: "Drama Club", organizerId: "o2", poster: "" },
    { id: "e4", title: "Career Fair Prep Session", description: "CV review and mock interview tips before the career fair.", category: "Career", date: demoDate(18), venue: "Seminar Hall", capacity: 80, club: "Computing Society", organizerId: "o1", poster: "" },
    { id: "e5", title: "Open Mic Evening", description: "Poetry, music and stand-up. Sign up on the day.", category: "Cultural", date: demoDate(-16), venue: "Cafeteria Lawn", capacity: 60, club: "Drama Club", organizerId: "o2", poster: "" },
    { id: "e6", title: "Git and GitHub Bootcamp", description: "Version control basics for beginners.", category: "Workshop", date: demoDate(-28), venue: "CS Lab 1", capacity: 40, club: "Computing Society", organizerId: "o1", poster: "" },
  ],
  registrations: [
    { id: "r1", eventId: "e2", userId: "s2", attended: false },
    { id: "r2", eventId: "e2", userId: "s3", attended: false },
    { id: "r3", eventId: "e6", userId: "s1", attended: true },
    { id: "r4", eventId: "e5", userId: "s1", attended: true },
    { id: "r5", eventId: "e1", userId: "s2", attended: false },
  ],
  feedback: [
    { id: "f1", eventId: "e6", userId: "s1", rating: 5, comment: "Great intro, very practical." },
  ],
};
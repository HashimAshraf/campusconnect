import { Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <>
      <header className="nav">
        <nav className="container">
          <Link className="brand" to="/">CampusConnect</Link>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<h1>CampusConnect</h1>} />
          <Route path="*" element={<p>Page not found. <Link to="/">Go home</Link></p>} />
        </Routes>
      </main>
    </>
  );
}

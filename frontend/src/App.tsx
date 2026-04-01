import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import ProjectsPage from "./pages/ProjectsPage";
import CartPage from "./pages/CartPage";
import DonatePage from "./pages/DonatePage";
import AdminBooksPage from "./pages/AdminBooksPage";

// Root component of the application.
// Sets up client-side routing (React Router) and the Bootstrap navigation bar.
function App() {
  return (
    // BrowserRouter enables URL-based navigation without full page reloads.
    <BrowserRouter>
      {/* Top navigation bar with links to the Books list and Cart pages */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand">
            Bookstore Project
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  Books
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/cart" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  Cart
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/adminbooks" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  Admin Books
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/donate/:id" element={<DonatePage />} />
        <Route path="/adminbooks" element={<AdminBooksPage />} />
        <Route path="*" element={<div className="container mt-5"><h3>Page not found</h3></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import ProjectsPage from "./pages/ProjectsPage";
import CartPage from "./pages/CartPage";
import DonatePage from "./pages/DonatePage";

function App() {
  return (
    <BrowserRouter>
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
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/donate/:id" element={<DonatePage />} />
        <Route path="*" element={<div className="container mt-5"><h3>Page not found</h3></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
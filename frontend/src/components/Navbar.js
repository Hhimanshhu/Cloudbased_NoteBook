import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeContext from "../Context/theme/ThemeContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");
  const { mode, toggleMode } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
  className={`navbar navbar-expand-lg sticky-top shadow-sm ${
    mode === "dark" ? "navbar-dark" : "navbar-light"
  }`}
  style={{
    backgroundColor:
      mode === "dark"
        ? "rgba(33, 37, 41, 0.7)"
        : "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(50px)",
    WebkitBackdropFilter: "blur(50px)",
    borderBottom:
      mode === "dark"
        ? "1px solid rgba(255,255,255,0.1)"
        : "1px solid rgba(0,0,0,0.1)",
  }}
>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={mode === "dark" ? "/novabook-dark.png" : "/novabook-light.png"}
            alt="NovaBook Logo"
            style={{ height: "45px", marginRight: "20px" }}
          />
          <span className="fw-bold">NovaBook</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/" ? "active" : ""
                    }`}
                    to="/"
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#features">
                    Features
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#contact">
                    Contact
                  </a>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/about" ? "active" : ""
                    }`}
                    to="/about"
                  >
                    About
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/dashboard" ? "active" : ""
                    }`}
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/trash" ? "active" : ""
                    }`}
                    to="/trash"
                  >
                    🗑️ Trash
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/about" ? "active" : ""
                    }`}
                    to="/about"
                  >
                    About
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center">
            <div className="form-check form-switch me-3">
              <input
                className="form-check-input"
                type="checkbox"
                onChange={toggleMode}
                id="themeSwitch"
                checked={mode === "dark"}
              />
              <label className="form-check-label" htmlFor="themeSwitch">
                {mode === "dark" ? "Dark" : "Light"} Mode
              </label>
            </div>

            {!isLoggedIn ? (
              <Link className="btn btn-outline-primary" to="/signup">
                Get Started
              </Link>
            ) : (
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

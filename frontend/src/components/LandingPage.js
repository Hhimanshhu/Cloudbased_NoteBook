import React, { useContext, useEffect } from "react";
import ThemeContext from "../Context/theme/ThemeContext";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
// import './LandingPage.css';

const LandingPage = () => {
  const { mode } = useContext(ThemeContext);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className={`landing-page ${mode}`}>
      {/* Hero Section */}
      <section className="hero py-5 text-center">
        <div className="container">
          <h1 className="display-4">Welcome to NovaBook</h1>
          <p className="lead">
            Your secure cloud-based notebook, accessible anywhere, anytime.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            {!localStorage.getItem("token") ? (
              <>
                <Link
                  to="/signup"
                  className={`btn btn-lg ${mode === "dark" ? "btn-primary" : "btn-warning text-dark"}`}
                >
                  Get Started
                </Link>

                <Link to="/login" className="btn btn-outline-light btn-lg">
                  Login
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn btn-success btn-lg">
                Your Notes →
              </Link>
            )}
          </div>
        </div>
      </section>

      <section id="features" className="py-5 bg-light text-dark">
        <div className="container">
          <h2 className="text-center mb-4" data-aos="fade-up">
            Features
          </h2>
          <div className="row text-center">
            <div className="col-md-4" data-aos="flip-left">
              <i className="fas fa-lock fa-3x mb-3"></i>
              <h4>Secure</h4>
              <p>Your notes are safe and encrypted using JWT authentication.</p>
            </div>
            <div className="col-md-4" data-aos="flip-up">
              <i className="fas fa-cloud-upload-alt fa-3x mb-3"></i>
              <h4>Cloud Based</h4>
              <p>Access your notes from any device, anywhere in the world.</p>
            </div>
            <div className="col-md-4" data-aos="flip-right">
              <i className="fas fa-bolt fa-3x mb-3"></i>
              <h4>Fast & Simple</h4>
              <p>Clean, minimal UI that keeps you focused on your thoughts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4" data-aos="fade-up">
            About NovaBook
          </h2>
          <p className="text-center" data-aos="fade-in">
            NovaBook is designed for professionals, students, and thinkers who
            want their notes to be available anytime, with maximum simplicity
            and privacy. Built with React, Node.js, and MongoDB.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 bg-dark text-light">
        <div className="container text-center">
          <h2 className="mb-4" data-aos="fade-up">
            Contact
          </h2>
          <p>Creator - Himanshu Magar</p>
          <p>Email: himanshumagar1030@gmail.com</p>
          <p>© {new Date().getFullYear()} NovaBook. All rights reserved.</p>
          <div className="mt-3" data-aos="zoom-in">
            <a href="https://twitter.com" className="text-light mx-2">
              <i className="fab fa-twitter fa-lg"></i>
            </a>
            <a href="https://github.com" className="text-light mx-2">
              <i className="fab fa-github fa-lg"></i>
            </a>
            <a href="https://linkedin.com" className="text-light mx-2">
              <i className="fab fa-linkedin fa-lg"></i>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

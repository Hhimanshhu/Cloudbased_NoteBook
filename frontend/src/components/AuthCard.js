import React, { useContext } from "react";
import ThemeContext from "../Context/theme/ThemeContext";
import { Link } from "react-router-dom";

const AuthCard = ({ title, children, footer }) => {
  const { mode } = useContext(ThemeContext);

  return (
    <div
      className={`d-flex justify-content-center align-items-center vh-100 ${
        mode === "dark" ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <div
        className={`card shadow p-4 rounded-4 w-100 mx-3`}
        style={{
          maxWidth: "400px",
          backgroundColor: mode === "dark" ? "#1e1e1e" : "#ffffff",
        }}
      >
        <h2 className="text-center mb-4">{title}</h2>
        {children}
        {footer && (
          <div className="text-center mt-4">
            <small
              className={mode === "dark" ? "text-light" : "text-secondary"}
            >
              {footer.includes("Login") ? (
                <>
                  {footer.split("Login")[0]}
                  <Link to="/login" className="ms-1">
                    Login instead
                  </Link>
                </>
              ) : (
                <>
                  {footer.split("Signup")[0]}
                  <Link to="/signup" className="ms-1">
                    Sign up now!
                  </Link>
                </>
              )}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCard;

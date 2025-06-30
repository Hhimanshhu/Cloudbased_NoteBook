import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";
import "./AuthCard.css";

const Login = (props) => {
  useEffect(() => {
    document.title = "Login | NovaBook";
  }, []);

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);     //Start loading

    try {
      const url = `http://localhost:5000/api/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const json = await response.json();
      setLoading(false); 

      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        props.showAlert("Logged in successfully", "success");
        navigate("/dashboard");
      } else {
        props.showAlert("Invalid credentials", "danger");
      }
    } catch (error) {
      setLoading(false);
      props.showAlert("Something went wrong. Please try again.", "danger");
    }
  };

  const onChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  return (
    <AuthCard title="Login to NovaBook" footer="Don't have an account?">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            name="email"
            className="form-control rounded"
            placeholder="Enter email"
            value={credentials.email}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group mt-3">
          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            value={credentials.password}
            onChange={onChange}
            name="password"
            placeholder="Password"
            required
          />
          <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="showPasswordCheck"
              onChange={() => setShowPassword(!showPassword)}
            />
            <label className="form-check-label" htmlFor="showPasswordCheck">
              Show Password
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 mt-4"
          disabled={loading} 
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <div className="text-end">
          <a href="/forgot-password" className="small">
            Forgot Password?
          </a>
        </div>
      </form>
    </AuthCard>
  );
};

export default Login;

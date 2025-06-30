import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Notestate from "./Context/notes/Notestate";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import ThemeState from "./Context/theme/ThemeState";
import LandingPage from "./components/LandingPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Trash from "./components/Trash";

function App() {
  const typeMap = {
    danger: "error", // handle Bootstrap's "danger" as Toastify's "error"
    error: "error",
    success: "success",
    warning: "warning",
    info: "info",
  };

  const showAlert = (message, type = "info") => {
    const toastFunc = toast[typeMap[type] || "info"]; // fallback to "info" if type is invalid
    toastFunc(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  return (
    <div>
      <ThemeState>
        <Notestate>
          <Router>
            <Navbar />
            <Routes>
              {/* <Route path="/" element={<LandingPage />} /> */}
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login showAlert={showAlert} />} />
              <Route
                path="/signup"
                element={<Signup showAlert={showAlert} />}
              />
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Home showAlert={showAlert} />
                  </ProtectedRoute>
                }
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route
                path="/trash"
                element={
                  <ProtectedRoute>
                    <Trash showAlert={showAlert} />
                  </ProtectedRoute>
                }
              />
            </Routes>
            
            <ToastContainer />
          </Router>
        </Notestate>
      </ThemeState>
    </div>
  );
}

export default App;
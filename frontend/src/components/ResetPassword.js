import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";
import ThemeContext from "../Context/theme/ThemeContext";

const ResetPassword = () => {
  useEffect(() => {
    document.title = "Login | NovaBook";
  }, []);

  const { token } = useParams();
  const navigate = useNavigate();
  const { mode } = useContext(ThemeContext);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true); 
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const json = await response.json();
      setLoading(false);

      if (json.message) {
        setMessage(json.message);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(json.error || "Something went wrong");
      }
    } catch (err) {
      setLoading(false);
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <AuthCard title="🔑 Reset Your Password">
      {error && <div className="alert alert-danger text-center">{error}</div>}
      {message && (
        <div className="alert alert-success text-center">{message}</div>
      )}

      <form onSubmit={handleReset}>
        <div className="form-group mt-3">
          <label>New Password</label>
          <input
            type="password"
            className={`form-control rounded ${
              mode === "dark" ? "bg-dark text-light border-secondary" : ""
            }`}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={5}
          />
        </div>

        <div className="form-group mt-3">
          <label>Confirm Password</label>
          <input
            type="password"
            className={`form-control rounded ${
              mode === "dark" ? "bg-dark text-light border-secondary" : ""
            }`}
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={5}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 mt-4"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </AuthCard>
  );
};

export default ResetPassword;





// import React, { useState, useContext, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import AuthCard from "./AuthCard";
// import ThemeContext from "../Context/theme/ThemeContext";

// const ResetPassword = () => {
//   useEffect(() => {
//     document.title = "Login | NovaBook";
//   }, []);

//   const { token } = useParams();
//   const navigate = useNavigate();
//   const { mode } = useContext(ThemeContext);

//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleReset = async (e) => {
//     e.preventDefault();

//     if (password !== confirm) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       setLoading(true); 
//       const response = await fetch(
//         `http://localhost:5000/api/auth/reset-password/${token}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ password }),
//         }
//       );

//       const json = await response.json();
//       setLoading(false);

//       if (json.message) {
//         setMessage(json.message);
//         setTimeout(() => navigate("/login"), 2000);
//       } else {
//         setError(json.error || "Something went wrong");
//       }
//     } catch (err) {
//       setLoading(false);
//       setError("Failed to reset password. Please try again.");
//     }
//   };

//   return (
//     <AuthCard title="🔑 Reset Your Password">
//       {error && <div className="alert alert-danger text-center">{error}</div>}
//       {message && (
//         <div className="alert alert-success text-center">{message}</div>
//       )}

//       <form onSubmit={handleReset}>
//         <div className="form-group mt-3">
//           <label>New Password</label>
//           <input
//             type="password"
//             className={`form-control rounded ${
//               mode === "dark" ? "bg-dark text-light border-secondary" : ""
//             }`}
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             minLength={5}
//           />
//         </div>

//         <div className="form-group mt-3">
//           <label>Confirm Password</label>
//           <input
//             type="password"
//             className={`form-control rounded ${
//               mode === "dark" ? "bg-dark text-light border-secondary" : ""
//             }`}
//             required
//             value={confirm}
//             onChange={(e) => setConfirm(e.target.value)}
//             minLength={5}
//           />
//         </div>

//         <button
//           type="submit"
//           className="btn btn-primary w-100 mt-4"
//           disabled={loading}
//         >
//           {loading ? (
//             <>
//               <span className="spinner-border spinner-border-sm me-2"></span>
//               Resetting...
//             </>
//           ) : (
//             "Reset Password"
//           )}
//         </button>
//       </form>
//     </AuthCard>
//   );
// };

// export default ResetPassword;

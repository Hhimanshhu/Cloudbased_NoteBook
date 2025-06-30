import React, { useState, useContext, useEffect } from "react";
import AuthCard from "./AuthCard";
import ThemeContext from "../Context/theme/ThemeContext";

const ForgotPassword = () => {
  useEffect(() => {
  document.title = "Login | NovaBook";
}, []);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { mode } = useContext(ThemeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${ import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const json = await res.json();

      if (json.success || json.message) {
        setSubmitted(true);
      } else {
        alert(json.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      alert("Server error. Try again later.");
    }

    setLoading(false);
  };

  return (
    <AuthCard title="Forgot Password?">
      {submitted ? (
        <div className="alert alert-success text-center">
          If your email is registered, you’ll receive a reset link shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              id="email"
              type="email"
              className={`form-control rounded ${mode === "dark" ? "bg-dark text-light border-secondary" : ""}`}
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-100 mt-3" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}
    </AuthCard>
  );
};

export default ForgotPassword;






// import React, { useState, useContext, useEffect } from "react";
// import AuthCard from "./AuthCard";
// import ThemeContext from "../Context/theme/ThemeContext";

// const ForgotPassword = () => {
//   useEffect(() => {
//   document.title = "Login | NovaBook";
// }, []);
//   const [email, setEmail] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { mode } = useContext(ThemeContext);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch(`http://localhost:5000/api/auth/forgot-password`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ email })
//       });

//       const json = await res.json();

//       if (json.success || json.message) {
//         setSubmitted(true);
//       } else {
//         alert(json.error || "Something went wrong.");
//       }
//     } catch (error) {
//       console.error("Forgot Password Error:", error);
//       alert("Server error. Try again later.");
//     }

//     setLoading(false);
//   };

//   return (
//     <AuthCard title="Forgot Password?">
//       {submitted ? (
//         <div className="alert alert-success text-center">
//           If your email is registered, you’ll receive a reset link shortly.
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email" className="form-label">Email address</label>
//             <input
//               id="email"
//               type="email"
//               className={`form-control rounded ${mode === "dark" ? "bg-dark text-light border-secondary" : ""}`}
//               placeholder="Enter your registered email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <button className="btn btn-primary w-100 mt-3" disabled={loading}>
//             {loading ? "Sending..." : "Send Reset Link"}
//           </button>
//         </form>
//       )}
//     </AuthCard>
//   );
// };

// export default ForgotPassword;

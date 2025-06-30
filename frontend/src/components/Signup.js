import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";
import "./AuthCard.css";

const passwordChecks = (password) => {
  return {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
};

const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 6) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  if (strength === 0) return { label: "", color: "" };
  if (strength <= 1) return { label: "Weak", color: "danger" };
  if (strength === 2) return { label: "Fair", color: "warning" };
  if (strength >= 3) return { label: "Strong", color: "success" };
};

const Signup = (props) => {
  
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordsMatch = credentials.password === credentials.cpassword;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isPasswordStrong = Object.values(
    passwordChecks(credentials.password)
  ).every(Boolean);
  
  useEffect(() => {
    document.title = "Signup | NovaBook";
     if (localStorage.getItem("token")) {
    navigate("/dashboard");
  }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!passwordsMatch) {
      props.showAlert("Passwords do not match", "danger");
      return;
    }

    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_URL}/api/auth/createuser`;
      const { name, email, password } = credentials;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await response.json();
      setLoading(false); 

      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        props.showAlert("Successfully Signed up", "success");
        navigate("/dashboard");
      } else {
        props.showAlert("Invalid credentials", "danger");
      }
    } catch (err) {
      setLoading(false);
      props.showAlert("Something went wrong", "danger");
    }
  };

  const onChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  return (
    <AuthCard
      title="Create an Account"
      footer="Already have an account? Login instead."
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="form-control rounded"
            placeholder="Enter your name"
            value={credentials.name}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group mt-3">
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
            type="password"
            name="password"
            className="form-control rounded"
            placeholder="Create password"
            value={credentials.password}
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        {credentials.password && (
          <span
            className={`badge bg-${
              getPasswordStrength(credentials.password).color
            }`}
          >
            {getPasswordStrength(credentials.password).label} Password
          </span>
        )}

        {credentials.password && (
          <ul className="list-unstyled small mt-2">
            {Object.entries(passwordChecks(credentials.password)).map(
              ([key, passed]) => (
                <li
                  key={key}
                  className={passed ? "text-success" : "text-danger"}
                >
                  <i
                    className={`me-1 fas fa-${passed ? "check" : "times"}`}
                  ></i>
                  {key === "length" && "Minimum 6 characters"}
                  {key === "uppercase" && "One uppercase letter"}
                  {key === "lowercase" && "One lowercase letter"}
                  {key === "number" && "One number"}
                  {key === "special" && "One special character"}
                </li>
              )
            )}
          </ul>
        )}

        <div className="form-group mt-3">
          <label>Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="cpassword"
            className={`form-control rounded ${
              credentials.cpassword && !passwordsMatch ? "is-invalid" : ""
            }`}
            placeholder="Confirm password"
            value={credentials.cpassword}
            onChange={onChange}
            minLength={5}
            required
          />
          {!passwordsMatch && credentials.cpassword && (
            <div className="invalid-feedback">Passwords do not match</div>
          )}
        </div>

        <div className="form-check mt-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="showConfirmPasswordCheck"
            checked={showConfirmPassword}
            onChange={() => setShowConfirmPassword(!showConfirmPassword)}
          />
          <label
            className="form-check-label"
            htmlFor="showConfirmPasswordCheck"
          >
            Show Confirm Password
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-success w-100 mt-4"
          disabled={!passwordsMatch || loading || !isPasswordStrong}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Signing Up...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
    </AuthCard>
  );
};

export default Signup;








// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AuthCard from "./AuthCard";
// import "./AuthCard.css";

// const passwordChecks = (password) => {
//   return {
//     length: password.length >= 6,
//     uppercase: /[A-Z]/.test(password),
//     lowercase: /[a-z]/.test(password),
//     number: /[0-9]/.test(password),
//     special: /[^A-Za-z0-9]/.test(password),
//   };
// };

// const getPasswordStrength = (password) => {
//   let strength = 0;
//   if (password.length >= 6) strength += 1;
//   if (/[A-Z]/.test(password)) strength += 1;
//   if (/[0-9]/.test(password)) strength += 1;
//   if (/[^A-Za-z0-9]/.test(password)) strength += 1;

//   if (strength === 0) return { label: "", color: "" };
//   if (strength <= 1) return { label: "Weak", color: "danger" };
//   if (strength === 2) return { label: "Fair", color: "warning" };
//   if (strength >= 3) return { label: "Strong", color: "success" };
// };

// const Signup = (props) => {
//   useEffect(() => {
//     document.title = "Login | NovaBook";
//   }, []);
//   const [credentials, setCredentials] = useState({
//     name: "",
//     email: "",
//     password: "",
//     cpassword: "",
//   });

//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const passwordsMatch = credentials.password === credentials.cpassword;
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const isPasswordStrong = Object.values(
//     passwordChecks(credentials.password)
//   ).every(Boolean);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!passwordsMatch) {
//       props.showAlert("Passwords do not match", "danger");
//       return;
//     }

//     try {
//       setLoading(true);
//       const url = `http://localhost:5000/api/auth/createuser`;
//       const { name, email, password } = credentials;

//       const response = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password }),
//       });

//       const json = await response.json();
//       setLoading(false); 

//       if (json.success) {
//         localStorage.setItem("token", json.authtoken);
//         props.showAlert("Successfully Signed up", "success");
//         navigate("/dashboard");
//       } else {
//         props.showAlert("Invalid credentials", "danger");
//       }
//     } catch (err) {
//       setLoading(false);
//       props.showAlert("Something went wrong", "danger");
//     }
//   };

//   const onChange = (e) =>
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });

//   return (
//     <AuthCard
//       title="Create an Account"
//       footer="Already have an account? Login instead."
//     >
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Name</label>
//           <input
//             type="text"
//             name="name"
//             className="form-control rounded"
//             placeholder="Enter your name"
//             value={credentials.name}
//             onChange={onChange}
//             required
//           />
//         </div>

//         <div className="form-group mt-3">
//           <label>Email address</label>
//           <input
//             type="email"
//             name="email"
//             className="form-control rounded"
//             placeholder="Enter email"
//             value={credentials.email}
//             onChange={onChange}
//             required
//           />
//         </div>

//         <div className="form-group mt-3">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             className="form-control rounded"
//             placeholder="Create password"
//             value={credentials.password}
//             onChange={onChange}
//             minLength={5}
//             required
//           />
//         </div>
//         {credentials.password && (
//           <span
//             className={`badge bg-${
//               getPasswordStrength(credentials.password).color
//             }`}
//           >
//             {getPasswordStrength(credentials.password).label} Password
//           </span>
//         )}

//         {credentials.password && (
//           <ul className="list-unstyled small mt-2">
//             {Object.entries(passwordChecks(credentials.password)).map(
//               ([key, passed]) => (
//                 <li
//                   key={key}
//                   className={passed ? "text-success" : "text-danger"}
//                 >
//                   <i
//                     className={`me-1 fas fa-${passed ? "check" : "times"}`}
//                   ></i>
//                   {key === "length" && "Minimum 6 characters"}
//                   {key === "uppercase" && "One uppercase letter"}
//                   {key === "lowercase" && "One lowercase letter"}
//                   {key === "number" && "One number"}
//                   {key === "special" && "One special character"}
//                 </li>
//               )
//             )}
//           </ul>
//         )}

//         <div className="form-group mt-3">
//           <label>Confirm Password</label>
//           <input
//             type={showConfirmPassword ? "text" : "password"}
//             name="cpassword"
//             className={`form-control rounded ${
//               credentials.cpassword && !passwordsMatch ? "is-invalid" : ""
//             }`}
//             placeholder="Confirm password"
//             value={credentials.cpassword}
//             onChange={onChange}
//             minLength={5}
//             required
//           />
//           {!passwordsMatch && credentials.cpassword && (
//             <div className="invalid-feedback">Passwords do not match</div>
//           )}
//         </div>

//         <div className="form-check mt-2">
//           <input
//             className="form-check-input"
//             type="checkbox"
//             id="showConfirmPasswordCheck"
//             checked={showConfirmPassword}
//             onChange={() => setShowConfirmPassword(!showConfirmPassword)}
//           />
//           <label
//             className="form-check-label"
//             htmlFor="showConfirmPasswordCheck"
//           >
//             Show Confirm Password
//           </label>
//         </div>

//         <button
//           type="submit"
//           className="btn btn-success w-100 mt-4"
//           disabled={!passwordsMatch || loading || !isPasswordStrong}
//         >
//           {loading ? (
//             <>
//               <span className="spinner-border spinner-border-sm me-2"></span>
//               Signing Up...
//             </>
//           ) : (
//             "Sign Up"
//           )}
//         </button>
//       </form>
//     </AuthCard>
//   );
// };

// export default Signup;

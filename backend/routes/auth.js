const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");


const JWT_SECRET = process.env.JWT_SECRET; 
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const nodemailer = require("nodemailer");



// ROUTE 1: Create a user using POST "/api/auth/createuser". No login required...............................................................
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    // Check for validation errors

    // console.log("Creating user with data:", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    // Check if user email already exists

    try {
      // Attempt to find a user with the provided email
      let user = await User.findOne({email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "User with this email already exists" });
      }

      const salt = bcrypt.genSaltSync(10);
      secPass = await bcrypt.hash(req.body.password, salt); 
      // If user does not exist, create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
      });
      
      const data = {
        user: {
          id: user.id
        }
      };

      // If user creation is successful, return the user object
      const authtoken = jwt.sign(data,JWT_SECRET);

     
      success = true;
      res.json({success,authtoken});
    
    
    } catch (error) {
      // If an error occurs, return a 500 status with the error message
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);



// Route 2: Authanticate a user using POST "/api/auth/login". No login required..................................................................
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Attempt to find a user with the provided email
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success, error: "Invalid credentials" });
      }

      // Compare the provided password with the stored hashed password
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({ success, error: "Invalid credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);




//Route 3: Get logged in user details using POST "/api/auth/getuser". Login required...............................................................
router.post("/getuser",fetchuser,async (req, res) => {
    try {
      // Get the user ID from the JWT token
      const userId = req.user.id;
      // Find the user by ID
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);


// Route 4: Forgot password - Send reset link to email using POST "/api/auth/forgot-password". No login required........................................
// FORGOT PASSWORD: Send reset link to email
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset - NovaBook",
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Reset link sent to email" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


// Route 5: Reset password using POST "/api/auth/reset-password". No login required...........................................................
// POST /api/auth/reset-password/:token

// ✅ Reset Password Route
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Decode JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("Reset error:", err.message);
    res.status(400).json({ error: "Invalid or expired token" });
  }
});




module.exports = router;

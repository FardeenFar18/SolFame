const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const otpGenerator = require("otp-generator");  // OTP Generator
const nodemailer = require("nodemailer");  // Correct import

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/auth-service", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Auth Service: Connected to MongoDB"))
  .catch((err) => console.error("Auth Service: MongoDB connection error:", err));

// User Schema and Model
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Routes

let transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: "fardeen.i@ideelit.com",
    pass: "Fardeen@1821",
  },
});

// Send OTP
app.post("/auth/sendOtp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Generate a 6-digit OTP
  const otp = otpGenerator.generate(6, { digits: true, alphabets: false, specialChars: false });

  // Store OTP permanently in the database (not in-memory)
  const otpData = {
    otp: otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // OTP expires in 5 minutes
  };

  // Save OTP in the database
  await User.findOneAndUpdate({ email }, { $set: { otp: otpData.otp, otpExpires: otpData.expiresAt } }, { upsert: true });

  // Send OTP via email
  try {
    await transporter.sendMail({
      from: "fardeen.i@ideelit.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
});

// Signup Route
app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, phone, address, password, confirmPassword, otp } = req.body;

    // Retrieve user and OTP from the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    // Check if OTP exists and if it's expired
    if (!user.otp || user.otpExpires < Date.now()) {
      return res.status(400).send({ message: "OTP has expired or is not valid" });
    }

    // Verify OTP
    if (otp !== user.otp) {
      return res.status(400).send({ message: "Invalid OTP" });
    }

    // Hash password before saving
    if (password !== confirmPassword) {
      return res.status(400).send({ message: "Passwords do not match!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user with the password and other details
    user.name = name;
    user.phone = phone;
    user.address = address;
    user.password = hashedPassword; // Storing hashed password
    user.confirmPassword = confirmPassword; // No need to store confirmPassword

    // Save the user
    await user.save();

    // Clean up OTP after successful signup
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(201).send({ message: "Signup successful!" });
  } catch (err) {
    res.status(500).send({ message: "Error during signup", error: err.message });
  }
});

// Login Route
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    // Compare the hashed password using bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    res.status(200).json({ message: "Login successful!", email: user.email, name: user.name });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Auth Service running on http://localhost:${PORT}`));

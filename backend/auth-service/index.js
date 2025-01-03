const express = require('express');
const bodyParser = require('body-parser');
const { Pool, Client } = require('pg');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
const { check, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');


dotenv.config();

const app = express();

// PostgreSQL connection using your provided configuration
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mahal_booking",
  password: "Fardeen@1821",
  port: 5432,
});



// Middleware
app.use(cors());  // Allow cross-origin requests from the React front-end
app.use(bodyParser.json());

// Zoho email setup using nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,  // Use environment variable
    pass: process.env.EMAIL_PASS,  // Use environment variable
  },
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email
const sendOTP = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Use environment variable
    to: email,
    subject: 'OTP for Signup',
    text: `Your OTP for signup is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('Error sending OTP email:', err);
    } else {
      console.log(`OTP sent: ${info.response}`);
    }
  });
};

// Endpoint to handle user signup (no OTP initially)
app.post('/auth/signup', async (req, res) => {
  const { name, email, password, confirmPassword, address, mobileNumber } = req.body;

  try {
    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the user already exists in the database
    const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Insert user data temporarily (without is_verified) to the database
    await pool.query('INSERT INTO users (name, email, password, address, mobile_number) VALUES ($1, $2, $3, $4, $5)', [
      name,
      email,
      password,
      address,
      mobileNumber
    ]);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60000); // OTP expires in 5 minutes

    // Store OTP and expiry in the database
    await pool.query('INSERT INTO otp_requests (email, otp, otp_expiry) VALUES ($1, $2, $3)', [email, otp, otpExpiry]);

    // Send OTP email to user
    sendOTP(email, otp);

    res.status(200).json({ message: 'Signup successful. OTP has been sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during signup', error: err.message });
  }
});

// Endpoint to verify OTP and store user data after verification
app.post('/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Retrieve OTP data from otp_requests
    const otpData = await pool.query('SELECT * FROM otp_requests WHERE email = $1', [email]);

    if (otpData.rows.length === 0) {
      return res.status(400).json({ message: 'OTP request not found' });
    }

    const otpRecord = otpData.rows[0];

    // Verify OTP and check expiry
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > new Date(otpRecord.otp_expiry)) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // OTP is valid, now store user data (since OTP is verified)
    const userData = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userData.rows.length === 0) {
      return res.status(400).json({ message: 'User data not found' });
    }

    const hashedPassword = bcrypt.hashSync(userData.rows[0].password, 8);

    // Insert the verified user data into the database and set is_verified = true
    await pool.query('UPDATE users SET password = $1, is_verified = true WHERE email = $2', [
      hashedPassword,
      email
    ]);

    // Clear OTP data from the database
    await pool.query('DELETE FROM otp_requests WHERE email = $1', [email]);

    res.status(200).json({ message: 'OTP verified, user data saved, you can now log in' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during OTP verification', error: err.message });
  }
});

// Endpoint to handle user login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const userData = user.rows[0];

    // Compare the provided password with the stored hashed password
    const isPasswordValid = bcrypt.compareSync(password, userData.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // If login is successful, return a success message
    res.status(200).json({
      message: 'Login successful',
      email: userData.email,
      name: userData.name,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

app.post('/auth/register', async (req, res) => {
  const { email, password, mahalName, mahalLocation, mahalCapacity, fileIds } = req.body;

  try {
    // First, insert user data into PostgreSQL
    const result = await pool.query(
      'INSERT INTO marriage_mahal (email, password, mahal_name, mahal_location, mahal_capacity) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [email, password, mahalName, mahalLocation, mahalCapacity]
    );
    
    // Store the file IDs into MongoDB as part of the user's profile (one common ObjectId)
    const fileUploadData = new fileUpload({
      marriageMahalProfile: fileIds.marriageMahalProfile,
      tradeLicense: fileIds.tradeLicense,
      foodLicense: fileIds.foodLicense,
      fireSafetyCertificate: fileIds.fireSafetyCertificate,
      healthSanitationLicense: fileIds.healthSanitationLicense,
      gstRegistration: fileIds.gstRegistration,
      liquorLicense: fileIds.liquorLicense,
      pestControlCertificate: fileIds.pestControlCertificate,
    });

    const savedFileData = await fileUploadData.save();

    // Update PostgreSQL record to associate MongoDB ObjectId with the user
    await pool.query(
      'UPDATE marriage_mahal SET mongo_object_id = $1 WHERE id = $2',
      [savedFileData._id, result.rows[0].id] // Store MongoDB ObjectId here
    );

    res.status(201).json({ message: 'Registration successful', id: result.rows[0].id });
  } catch (error) {
    console.error('Error saving registration:', error);
    res.status(500).json({ error: 'Failed to save registration' });
  }
});






// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);  // Log the error stack
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Server setup
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

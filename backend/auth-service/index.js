const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const cors = require('cors');
const AWS = require('aws-sdk');
const axios = require('axios');
const dotenv = require('dotenv');
var unirest = require("unirest");

dotenv.config();

const app = express();

// PostgreSQL connection using provided configuration
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mahal_booking",
  password: "Fardeen@1821", // Use environment variable for password
  port: 5432,
});

// Middleware
app.use(cors()); // Allow cross-origin requests from the React front-end
app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' }));

// Nodemailer email setup
const transporter = nodemailer.createTransport({
  secure: true,
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: "solfame63@gmail.com", // Use environment variables for credentials
    pass: "cmmaroeculnhfpwg", // App password for Gmail
  },
});

// AWS SNS Configuration
// AWS.config.update({
//   region: 'eu-north-1', // AWS region
//   accessKeyId: 'AKIAXTORPYBOERD6WO72',
//   secretAccessKey:'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',
// });

const sns = new AWS.SNS(); // Initialize AWS SNS service

// Helper Functions
const generateEmailOTP = (username, mobileNumber) => {
  if (!username || username.length < 1) {
    throw new Error("Username must be at least one character long");
  }

  if (!mobileNumber || mobileNumber.length < 8) {
    throw new Error("Mobile number must be at least 8 digits long");
  }

  const firstLetter = username[0].toUpperCase();
  const shuffledIndices = Array.from({ length: mobileNumber.length }, (_, i) => i)
    .sort(() => Math.random() - 0.5);
  const firstPart = mobileNumber[shuffledIndices[0]] + mobileNumber[shuffledIndices[1]];
  const secondPart = Math.floor(Math.random() * 10);

  return `${firstLetter}${firstPart}S${secondPart.toString().padStart(2, '0')}F`;
};

const generateMobileOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendSMSUsingSNS = async (otp, mobileNumber) => {
  if (process.env.SKIP_OTP === 'true') {
    console.log(`Skipping SMS. OTP for ${mobileNumber} is: ${otp}`);
    return otp;
  }

  if (!mobileNumber || mobileNumber.trim().length < 10) {
    throw new Error('Invalid mobile number');
  }

  const formattedNumber = mobileNumber.trim();
  const apiKey = 'FhN1lodydbR2WQPYkPKIbCbuC0jIvJ09CIicrw1WNFvlVMbAdnf08CqxFWrR'; // Replace with your actual API key

  var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");

  req.query({
    "authorization": apiKey,
    "variables_values": otp,
    "route": "otp",
    "numbers": formattedNumber
  });

  req.headers({
    "cache-control": "no-cache"
  });

  return new Promise((resolve, reject) => {
    req.end(function (res) {
      if (res.error) {
        console.error('Error sending SMS via Fast2SMS:', res.error);
        reject(new Error('Failed to send SMS'));
      } else {
        console.log('SMS sent successfully:', res.body);
        resolve(otp);
      }
    });
  });
};

 sendEmailOTP = async (otp, email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'OTP for Signup',
    text: `Your OTP for email signup is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email OTP sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send email');
  }
};

// Routes

// Signup Route
app.post('/auth/signup', async (req, res) => {
  const { name, email, password, confirmPassword, address, mobileNumber } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, address, mobile_number) VALUES ($1, $2, $3, $4, $5)',
      [name, email, password, address, mobileNumber]
    );

    const emailOtp = generateEmailOTP(name, mobileNumber);
    const mobileOtp = generateMobileOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60000);

    await pool.query(
      'INSERT INTO otp_requests (email, otp, otp_expiry, mobile_otp, mobile_otp_expiry, mobile_number) VALUES ($1, $2, $3, $4, $5, $6)',
      [email, emailOtp, otpExpiry, mobileOtp, otpExpiry, mobileNumber]
    );

    await sendEmailOTP(emailOtp, email);
    await sendSMSUsingSNS(mobileOtp, mobileNumber);

    res.status(200).json({ message: 'Signup successful. OTPs sent to email and mobile.' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error during signup', error: err.message });
  }
});

// Verify Email OTP Route
app.post('/auth/verify-email-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpData = await pool.query('SELECT * FROM otp_requests WHERE email = $1', [email]);

    if (otpData.rows.length === 0) {
      return res.status(400).json({ message: 'OTP request not found' });
    }

    const otpRecord = otpData.rows[0];

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > new Date(otpRecord.otp_expiry)) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    await pool.query('UPDATE users SET is_verified = true WHERE email = $1', [email]);
    await pool.query('UPDATE otp_requests SET otp_verified = true WHERE email = $1', [email]);

    res.status(200).json({ message: 'Email OTP verified successfully' });
  } catch (err) {
    console.error('Error verifying email OTP:', err);
    res.status(500).json({ message: 'Server error during OTP verification', error: err.message });
  }
});

// Verify Mobile OTP Route
app.post('/auth/verify-mobile-otp', async (req, res) => {
  const { mobileNumber, otp } = req.body;

  try {
    const otpData = await pool.query('SELECT * FROM otp_requests WHERE mobile_number = $1', [mobileNumber]);

    if (otpData.rows.length === 0) {
      return res.status(400).json({ message: 'OTP request not found' });
    }

    const otpRecord = otpData.rows[0];

    if (otpRecord.mobile_otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > new Date(otpRecord.mobile_otp_expiry)) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    await pool.query('UPDATE otp_requests SET mobile_otp_verified = true WHERE mobile_number = $1', [mobileNumber]);

    res.status(200).json({ message: 'Mobile OTP verified successfully' });
  } catch (err) {
    console.error('Error verifying mobile OTP:', err);
    res.status(500).json({ message: 'Server error during OTP verification', error: err.message });
  }
});

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
    // const isPasswordValid = bcrypt.compareSync(password, userData.password);

    // if (!isPasswordValid) {
    //   return res.status(400).json({ message: 'Invalid credentials' });
    // }

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

app.post('/auth/ownerlogin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query the owners table (adjust table and column names as necessary)
    const owner = await pool.query('SELECT * FROM marriage_mahal_info WHERE email = $1', [email]);

    if (owner.rows.length === 0) {
      return res.status(400).json({ message: 'Owner not found' });
    }

    const ownerData = owner.rows[0];

    // Compare the provided password with the stored hashed password
    const isPasswordValid = bcrypt.compareSync(password, ownerData.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      email: ownerData.email,
      name: ownerData.mahal_name, // Assuming `mahal_name` is the owner's name
      role: 'owner', // Add role for owners
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

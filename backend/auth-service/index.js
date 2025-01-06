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
app.use(express.json({ limit: '50mb' }));


// Zoho email setup using nodemailer
const transporter = nodemailer.createTransport({
 secure:true,
 host:'smtp.gmail.com',
 port:465,
  auth: {
    user: 'solfame63@gmail.com',  // Gmail address
    pass: 'cmmaroeculnhfpwg',  // App password (not the Gmail account password)
  },
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email
const sendOTP = (email, otp) => {
  const mailOptions = {
    from: 'solfame63@gmail.com',
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


app.post('/auth/register', async (req, res) => {
  const { email, password, mahalName, mahalLocation, mahalCapacity, fileId } = req.body;
  console.log('189', fileId);

  try {
    // Check if the email already exists
    const existingUser = await pool.query(
      'SELECT * FROM marriage_mahal_info WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Insert the new user into the database
    const result = await pool.query(
      'INSERT INTO marriage_mahal_info (email, password, mahal_name, mahal_location, mahal_capacity, fileid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [email, hashedPassword, mahalName, mahalLocation, mahalCapacity, fileId]
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

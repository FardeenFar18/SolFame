import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useLocation, useNavigate } from 'react-router-dom';
import './SignupForm.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      // Send user data to backend (without storing it initially)
      const response = await axios.post('http://localhost:5000/auth/signup', {
        name,
        email,
        password,
        confirmPassword,
        address,
        mobileNumber,
      });
      // Show success alert using Swal
      Swal.fire({
        icon: 'success',
        title: 'Signup Submitted',
        text: response.data.message,
      });
      setIsOtpSent(true); // Show OTP input form
    } catch (error) {
      // Show error alert using Swal
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: error.response?.data?.message || 'Error during signup',
      });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      // Send OTP verification request to backend
      const response = await axios.post('http://localhost:5000/auth/verify-otp', {
        email,
        otp,
      });
      // Show success alert using Swal
      Swal.fire({
        icon: 'success',
        title: 'OTP Verified',
        text: response.data.message,
      });
      setIsOtpVerified(true); // OTP is verified, now store user data
      navigate("/login")
    } catch (error) {
      // Show error alert using Swal
      Swal.fire({
        icon: 'error',
        title: 'OTP Verification Failed',
        text: error.response?.data?.message || 'Error during OTP verification',
      });
    }
  };

  return (
    <div className='signup-form'>
      <h2>Signup</h2>
      <div>
        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your mobile number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        <button onClick={handleSignup} disabled={isOtpSent}>
          Signup
        </button>
      </div>

      {isOtpSent && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp} disabled={isOtpVerified}>
            Verify OTP
          </button>
        </div>
      )}
    </div>
  );
};

export default Signup;

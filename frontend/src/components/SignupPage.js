import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useNavigate } from 'react-router-dom';
import './SignupForm.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false); // Track email OTP generation
  const [isEmailOtpVerified, setIsEmailOtpVerified] = useState(false); // Track email OTP verification
  const [isMobileOtpSent, setIsMobileOtpSent] = useState(false); // Track mobile OTP generation
  const [isMobileOtpVerified, setIsMobileOtpVerified] = useState(false); // Track mobile OTP verification
  const [emailOtp, setEmailOtp] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      // Send user data to backend and generate Email OTP
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
      setIsEmailOtpSent(true); // Indicate that email OTP is sent
    } catch (error) {
      // Show error alert using Swal
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: error.response?.data?.message || 'Error during signup',
      });
    }
  };

  const handleVerifyEmailOtp = async () => {
    try {
      // Verify Email OTP with backend
      const response = await axios.post('http://localhost:5000/auth/verify-email-otp', {
        email,
        otp: emailOtp,
      });
      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Email OTP Verified',
        text: response.data.message,
      });
      setIsEmailOtpVerified(true); // Email OTP is verified
      setIsMobileOtpSent(true); // Allow mobile OTP generation
    } catch (error) {
      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Email OTP Verification Failed',
        text: error.response?.data?.message || 'Error during email OTP verification',
      });
    }
  };

  const handleVerifyMobileOtp = async () => {
    try {
      // Verify Mobile OTP with backend
      const response = await axios.post('http://localhost:5000/auth/verify-mobile-otp', {
        mobileNumber,
        otp: mobileOtp,
      });
      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Mobile OTP Verified',
        text: response.data.message,
      });
      setIsMobileOtpVerified(true); // Mobile OTP is verified
      navigate('/login'); // Redirect to login page
    } catch (error) {
      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Mobile OTP Verification Failed',
        text: error.response?.data?.message || 'Error during mobile OTP verification',
      });
    }
  };

  return (
    <div className="signup-form">
      <h2>Signup</h2>
      {!isEmailOtpSent && (
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
          <button onClick={handleSignup}>Signup</button>
        </div>
      )}

      {isEmailOtpSent && !isEmailOtpVerified && (
        <div>
          <input
            type="text"
            placeholder="Enter Email OTP"
            value={emailOtp}
            onChange={(e) => setEmailOtp(e.target.value)}
          />
          <button onClick={handleVerifyEmailOtp}>Verify Email OTP</button>
        </div>
      )}

      {isEmailOtpVerified && !isMobileOtpVerified && (
        <div>
          <input
            type="text"
            placeholder="Enter Mobile OTP"
            value={mobileOtp}
            onChange={(e) => setMobileOtp(e.target.value)}
          />
          <button onClick={handleVerifyMobileOtp}>Verify Mobile OTP</button>
        </div>
      )}
    </div>
  );
};

export default Signup;

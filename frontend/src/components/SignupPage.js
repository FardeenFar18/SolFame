import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './SignupForm.css';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!formData.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Email',
        text: 'Please enter your email address before requesting an OTP.',
      });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match! Please try again.',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/auth/sendOtp', {
        email: formData.email,
      });

      Swal.fire({
        icon: 'success',
        title: 'OTP Sent',
        text: 'OTP has been sent to your email address!',
      });

      // Redirect to OTP verification page
      navigate('/verify-otp', { state: { email: formData.email, password: formData.password } });
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error sending OTP.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error sending OTP. Please try again.',
      });
    }
  };

  return (
    <div className="signup-form">
      <h2>Sign Up</h2>
      {error && <p className="error-message">{error}</p>}
      <form>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="button" onClick={sendOtp}>
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default SignupForm;

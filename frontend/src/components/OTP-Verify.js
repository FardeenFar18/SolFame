import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SignupForm.css';
import Swal from 'sweetalert2';

const VerifyOtp = () => {
  const [enteredOtp, setEnteredOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { email, otp } = location.state || {};

  const handleVerify = () => {
    if (enteredOtp === otp) {
        Swal.fire({
            icon: 'success',
            title: 'OTP Verified',
            text: 'Signup Succesful',
          });
      navigate('/login'); // Redirect to success page
    } else {
        Swal.fire({
            icon: 'Wrong',
            title: 'Invalid OTP',
            text: 'Please try again',
          });
    }
  };

  return (
    <div className='signup-form'>
      <h2>Verify OTP</h2>
      <p>OTP has been sent : {email}</p>
      <input
        type="text"
        placeholder="Enter OTP"
        value={enteredOtp}
        onChange={(e) => setEnteredOtp(e.target.value)}
        required
      />
      <button onClick={handleVerify}>Verify OTP</button>
    </div>
  );
};

export default VerifyOtp;

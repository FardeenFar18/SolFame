
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [key, setKey] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const correctKey = 'secret123';

  
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  
  const handleKeyChange = (e) => {
    setKey(e.target.value);
  };

  const handleForgotPassword = () => {
   // console.log('Forgot password');
    navigate('/forgot-password');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (username === 'admin' && password === 'password123') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  
  const handleKeySubmit = (e) => {
    e.preventDefault();

    if (key === correctKey) {
      setModalVisible(true);
    } else {
      setError('Invalid key! Please try again.');
    }
  };

  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const closeModal = () => {
    setModalVisible(false);
    navigate('/Home-Page');
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>

      {!isLoggedIn ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="username" style={styles.label}>
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            style={styles.input}
            required
          />
          <br />

          <label style={styles.label}>
            Password:
          </label>
          <div style={styles.passwordContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={handlePasswordChange}
              style={styles.input}
              required
            />
            <span onClick={togglePasswordVisibility} style={styles.eyeIcon}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        

        

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            Login
          </button> 
          <br />
          <button
            type="button"
            onClick={handleForgotPassword}
            style={styles.forgotButton}
          >
            Forgot Password
          </button>
        </form>
      ) : (
        <form onSubmit={handleKeySubmit} style={styles.form}>
          <label htmlFor="key" style={styles.label}>
            Enter Key:
          </label>
          <input
            type="text"
            id="key"
            value={key}
            onChange={handleKeyChange}
            style={styles.input}
            required
          />
          <br />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            Submit Key
          </button>
        </form>
      )}

      {modalVisible && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <p>Login successful...</p>
            <button onClick={closeModal} style={styles.okButton}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  label: {
    marginBottom: '8px',
    fontSize: '16px',
  },
  input: {
    padding: '10px',
    marginBottom: '10px',
    fontSize: '16px',
    width: '210px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  passwordContainer: {
    position: 'relative',
    width: '230px',
  },
  eyeIcon: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
  },
  forgotButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',

  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  modal: {
    display: 'flex',
    position: 'fixed',
    zIndex: 1,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fefefe',
    padding: '20px',
    border: '1px solid #888',
    width: '80%',
    maxWidth: '300px',
    borderRadius: '10px',
    textAlign: 'center',
  },
  okButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
  },
  okButtonHover: {
    backgroundColor: 'white',
    color: 'black',
  },
};

export default Login;

import React, { useState } from "react";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // To store error message
  const [loading, setLoading] = useState(false); // To manage loading state

  

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
    

        // Store name and email in sessionStorage
        sessionStorage.setItem("username", data.name);
        sessionStorage.setItem("email", data.email);

        alert("login successful ",data.name);

        // Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed, please try again");
      }
    } catch (error) {
      setError("An error occurred while logging in. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Login</h2>

        {error && <p className="error-message">{error}</p>} {/* Display error message */}

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <button type="submit1" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

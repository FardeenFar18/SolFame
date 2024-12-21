import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Settings.css";

const Settings = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    password: "",
    email: "",
  });

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedUsername = sessionStorage.getItem("username");

    if (storedEmail && storedUsername) {
      setUserDetails({ name: storedUsername, email: storedEmail, password: "" });
    } else {
      // Fetch user details
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get("http://localhost:5000/user/details");
          setUserDetails({ ...response.data, password: "" });
        } catch (err) {
          console.error("Failed to fetch user details:", err);
        }
      };
      fetchUserDetails();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
        const { name, password, email } = userDetails;

        const response = await axios.put('http://localhost:5001/user/update', {
            email, // Include email in the request
            name,
            password,
        });

        alert('Settings saved successfully!');
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error updating user details:', error.response?.data || error.message);
        alert(`Failed to save settings. ${error.response?.data?.message || error.message}`);
    }
};

  return (
    <div className="settings-page">
      <h2>Account Settings</h2>
      <form>
        <label>
          Name:
          <input
            name="name"
            value={userDetails.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input name="email" value={userDetails.email} disabled />
        </label>
        <label>
          Password:
          <input
            name="password"
            type="password"
            value={userDetails.password}
            onChange={handleChange}
          />
        </label>
        <button type="button" onClick={handleSave}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Settings;

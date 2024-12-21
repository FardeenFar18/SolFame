import React, { useState } from "react";
import axios from "axios";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    hallId: "",
    userName: "",
    date: "",
    contact: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/book", formData).then((res) => {
      alert(res.data.message);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Book a Hall</h2>
      <input
        type="text"
        name="hallId"
        placeholder="Hall ID"
        value={formData.hallId}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="userName"
        placeholder="Your Name"
        value={formData.userName}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="contact"
        placeholder="Contact Number"
        value={formData.contact}
        onChange={handleChange}
        required
      />
      <button type="submit">Book Now</button>
    </form>
  );
};

export default BookingForm;

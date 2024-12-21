import React, { useState } from 'react';
import axios from 'axios';
import './CreateBooking.css';

const CreateBooking = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    email:'',
    venue: '',
    eventDate: '',
    eventType: '',
    numberOfGuests: '',
    audioSystem: '',
    ledTV: '',
    projectorScreen: '',
    hallCarpet: '',
    stageDecoration: '',
    lighting: '',
    playStation: '',
    ac:'',
    room:'',
  });

  const [message, setMessage] = useState('');

  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add username and email from sessionStorage to formData
      const username = sessionStorage.getItem('username');
      const email = sessionStorage.getItem('email');

      const dataToSend = {
        ...formData,
        username,
        email,
      };

      // Send form data to the backend
      const response = await axios.post('http://localhost:5000/api/bookings', dataToSend);
      setMessage(response.data.message);

      // Clear form fields after successful submission
      setFormData({
        customerName: '',
        email:'',
        venue: '',
        eventDate: '',
        eventType: '',
        numberOfGuests: '',
        audioSystem: '',
        ledTV: '',
        projectorScreen: '',
        hallCarpet: '',
        stageDecoration: '',
        lighting: '',
        playStation: '',
        ac: '',
        rooms: '',
      });
    } catch (error) {
      setMessage('Failed to create booking.');
    }
  };

  return (
    <div className="create-booking">
      <h2>Mahal Booking</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="customerName">Customer Name</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="venue">Venue</label>
          <select
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
          >
            <option value="">Select Venue</option>
            <option value="Venue A">Venue A</option>
            <option value="Venue B">Venue B</option>
            <option value="Venue C">Venue C</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="eventDate">Event Date</label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="eventType">Event Type</label>
          <select
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            required
          >
            <option value="">Select Event Type</option>
            <option value="Wedding">Wedding</option>
            <option value="Conference">Conference</option>
            <option value="Birthday">Birthday</option>
            <option value="Baby Showers">Baby Showers</option>
            <option value="Family Event">Family Event</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="numberOfGuests">Number of Guests</label>
          <input
            type="number"
            id="numberOfGuests"
            name="numberOfGuests"
            value={formData.numberOfGuests}
            onChange={handleChange}
            required
          />
        </div>

        {/* Additional Questions */}
        <div className="form-group">
  <label htmlFor="audioSystem">Do you want an Audio System & Music System?</label>
  <select
    id="audioSystem"
    name="audioSystem"
    value={formData.audioSystem}
    onChange={handleChange}
    required
  >
    <option value="">Select Yes or No</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="ledTV">Do you want an LED TV?</label>
  <select
    id="ledTV"
    name="ledTV"
    value={formData.ledTV}
    onChange={handleChange}
    required
  >
    <option value="">Select Yes or No</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="projectorScreen">Do you want a Projector Screen?</label>
  <select
    id="projectorScreen"
    name="projectorScreen"
    value={formData.projectorScreen}
    onChange={handleChange}
    required
  >
    <option value="">Select Yes or No</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="hallCarpet">Do you want a Hall Carpet?</label>
  <select
    id="hallCarpet"
    name="hallCarpet"
    value={formData.hallCarpet}
    onChange={handleChange}
    required
  >
    <option value="">Select Yes or No</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="stageDecoration">Do you want Stage Decoration?</label>
  <select
    id="stageDecoration"
    name="stageDecoration"
    value={formData.stageDecoration}
    onChange={handleChange}
    required
  >
    <option value="">Select Yes or No</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="lighting">Do you want Lighting?</label>
  <select
    id="lighting"
    name="lighting"
    value={formData.lighting}
    onChange={handleChange}
    required
  >
    <option value="">Select Yes or No</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="playStation">Do you want a Play Station?</label>
  <select
    id="playStation"
    name="playStation"
    value={formData.playStation}
    onChange={handleChange}
    required
  >
    <option value="">Select Yes or No</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="ac">Do you want AC?</label>
  <select
    id="ac"
    name="ac"
    value={formData.ac}
    onChange={handleChange}
    required
  >
    <option value="">Select Yes or No</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="rooms">Do you want Rooms?</label>
  <select
    id="rooms"
    name="rooms"
    value={formData.rooms}
    onChange={handleChange}
    required
  >
    <option value="">Select Yes or No</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>



        <button type="submits" className="submit-btn1">Create Booking</button>
      </form>

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default CreateBooking;

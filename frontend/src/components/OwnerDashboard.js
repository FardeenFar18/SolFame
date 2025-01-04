import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OwnerDashboard = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [available, setAvailable] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    // Fetch initial data (slots, bookings, etc.)
    axios.get('http://localhost:5000/api/slots')
      .then(response => setSlots(response.data))
      .catch(error => console.error('Error fetching slots:', error));

    axios.get('http://localhost:5000/api/bookings')
      .then(response => setBookings(response.data))
      .catch(error => console.error('Error fetching bookings:', error));
    
    // Fetch revenue data
    axios.get('http://localhost:5000/api/revenue')
      .then(response => setRevenue(response.data))
      .catch(error => console.error('Error fetching revenue:', error));
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('mahalImage', image);

    try {
      const response = await axios.post('http://localhost:5000/api/mahal-images', formData);
      setImageUrl(response.data.imageUrl);
      alert('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    const newSlot = { date, time, available };

    try {
      await axios.post('http://localhost:5000/api/slots', newSlot);
      alert('Slot added successfully');
      setSlots([...slots, newSlot]);
    } catch (error) {
      console.error('Error adding slot:', error);
      alert('Error adding slot');
    }
  };

  return (
    <div className="dashboard">
      <h1>Marriage Mahal Owner Dashboard</h1>

      {/* Dashboard Overview */}
      <div className="section overview">
        <h2>Dashboard Overview</h2>
        <p>Revenue: ₹{revenue}</p>
        <p>Total Bookings: {bookings.length}</p>
        {/* Add more metrics or visual charts here */}
      </div>

      {/* Mahal Image Upload */}
      <div className="section">
        <h2>Upload Mahal Image</h2>
        <form onSubmit={handleImageUpload}>
          <input type="file" onChange={handleImageChange} required />
          <button type="submit">Upload Image</button>
        </form>
        {imageUrl && <img src={`http://localhost:5000${imageUrl}`} alt="Mahal" width="300" />}
      </div>

      {/* Slot Management */}
      <div className="section">
        <h2>Manage Slots</h2>
        <form onSubmit={handleAddSlot}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          <label>
            Available:
            <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
          </label>
          <button type="submit">Add Slot</button>
        </form>
        <h3>Available Slots</h3>
        <ul>
          {slots.map((slot) => (
            <li key={slot._id}>
              {new Date(slot.date).toLocaleDateString()} {slot.time} - {slot.available ? 'Available' : 'Not Available'}
            </li>
          ))}
        </ul>
      </div>

      {/* Bookings */}
      <div className="section">
        <h2>Bookings</h2>
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              {booking.customerName} - {booking.date} {booking.time} - Status: {booking.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OwnerDashboard;

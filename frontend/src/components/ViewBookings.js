import React, { useState, useEffect } from 'react';
import './ViewBookings.css';
import EditBooking from './EditBooking';

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null); // State for editing
  const [username, setUsername] = useState('');  // State for username
  const [email, setEmail] = useState('');  // State for email

  useEffect(() => {
    // Get username and email from sessionStorage
    const storedUsername = sessionStorage.getItem('username');
    const storedEmail = sessionStorage.getItem('email');
    setUsername(storedUsername || '');  // Set username if available
    setEmail(storedEmail || '');  // Set email if available
  
    const fetchBookings = async () => {
      setIsLoading(true);
  
      try {
        const response = await fetch(`http://localhost:5000/api/bookings?email=${storedEmail}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings.');
        }
  
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBookings();
  }, []);
  

  // Handle Edit Button Click
  const handleEditClick = (booking) => {
    setEditingBooking(booking);
  };

  // Handle Save after Edit
  const handleSave = (updatedBooking) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking._id === updatedBooking._id ? updatedBooking : booking
      )
    );
    setEditingBooking(null); // Exit edit mode
  };

  // Handle Cancel Edit
  const handleCancel = () => {
    setEditingBooking(null); // Exit edit mode without saving
  };

  return (
    <div className="view-bookings">
      {/* Conditionally render the heading */}
      {!editingBooking && <h2>Your Bookings</h2>}
      <div className="user-info">
        {/* Display username and email */}
       
      </div>
      {isLoading ? (
        <p>Loading bookings...</p>
      ) : bookings.length > 0 ? (
        <div className="bookings-list">
          {bookings.map((booking) =>
            editingBooking && editingBooking._id === booking._id ? (
              // Render Edit Form
              <EditBooking
                key={booking._id}
                booking={editingBooking}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              // Render Booking Details
              <div key={booking._id} className="booking-card">
                <h3>{booking.venue}</h3>
                <p>
                  <strong>Customer:</strong> {booking.customerName}
                </p>
                <p>
                  <strong>Event Date:</strong> {new Date(
                    booking.eventDate
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Event Type:</strong> {booking.eventType}
                </p>
                <p>
                  <strong>Guests:</strong> {booking.numberOfGuests}
                </p>
                <button onClick={() => handleEditClick(booking)}>Edit</button>
              </div>
            )
          )}
        </div>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default ViewBookings;

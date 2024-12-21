import React, { useState, useEffect } from 'react';
import './EditBooking.css';

const EditBooking = ({ booking, onSave, onCancel }) => {
  const [editingBooking, setEditingBooking] = useState(booking);

  useEffect(() => {
    setEditingBooking(booking);
  }, [booking]);

  // Handle Input Changes in Edit Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingBooking((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Form Submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${editingBooking._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingBooking),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update booking.');
      }

      const updatedBooking = await response.json();
      onSave(updatedBooking); // Notify parent about the update
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="edit-booking">
      <h3>Edit Booking</h3>
      <form onSubmit={handleFormSubmit} className="booking-card edit-form">
        <input
          type="text"
          name="customerName"
          value={editingBooking.customerName}
          onChange={handleInputChange}
          placeholder="Customer Name"
          required
        />
        <input
          type="text"
          name="venue"
          value={editingBooking.venue}
          onChange={handleInputChange}
          placeholder="Venue"
          required
          disabled
        />
        <input
          type="date"
          name="eventDate"
          value={editingBooking.eventDate.split('T')[0]}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="eventType"
          value={editingBooking.eventType}
          onChange={handleInputChange}
          placeholder="Event Type"
          required
          disabled
        />
        <input
          type="number"
          name="numberOfGuests"
          value={editingBooking.numberOfGuests}
          onChange={handleInputChange}
          placeholder="Number of Guests"
          required
        />
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditBooking;

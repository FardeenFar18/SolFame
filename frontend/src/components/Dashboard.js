import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const DashboardActions = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingApprovals: 0,
    upcomingEvents: 0,
  });

  // Fetch username and email from sessionStorage
  const username = sessionStorage.getItem('username');
  const email = sessionStorage.getItem('email');

  useEffect(() => {
    const fetchStats = async () => {
      const storedEmail = sessionStorage.getItem('email');  // Get email from sessionStorage
  
      if (!storedEmail) {
        console.error("Email not found in sessionStorage.");
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:5000/api/stats?email=${storedEmail}`);
        const data = await response.json();
        setStats(data); // Update state with fetched stats
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
  
    fetchStats();
  }, []);
  

  const handleCreateBooking = () => {
    navigate('/createbooking');
  };

  const handleViewBooking = () => {
    navigate('/viewbooking');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
        <h1>Welcome to {username}'s Dashboard</h1>
        <p>Manage your bookings, venues, and account settings.</p>
      </header>

      <section className="dashboard-stats">
        <div className="stats-card">
          <h3>Total Bookings</h3>
          <p>{stats.totalBookings}</p>
        </div>
        <div className="stats-card">
          <h3>Pending Approvals</h3>
          <p>{stats.pendingApprovals}</p>
        </div>
        <div className="stats-card">
          <h3>Upcoming Events</h3>
          <p>{stats.upcomingEvents}</p>
        </div>
      </section>

      <section className="dashboard-actions">
        <div className="action-card">
          <h3>Create New Booking</h3>
          <p>Create and manage new bookings for venues.</p>
          <button onClick={handleCreateBooking}>Create Booking</button>
        </div>
        <div className="action-card">
          <h3>View Bookings</h3>
          <p>View and edit all your previous and current bookings.</p>
          <button onClick={handleViewBooking}>View Bookings</button>
        </div>
        <div className="action-card">
          <h3>Account Settings</h3>
          <p>Update your profile, preferences, and account details.</p>
          <button onClick={handleSettings}>Settings</button>
        </div>
      </section>
    </div>
  );
};

export default DashboardActions;

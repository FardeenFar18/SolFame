import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Discover Your Perfect Venue</h1>
          <p>Effortlessly book the ideal mahal for every celebration!</p>
          <Link to="/login" className="hero-btn primary-btn">Get Started</Link>
        </div>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <h2>Our Key Features</h2>
        <div className="features">
          <div className="feature-card">
            <img src="https://via.placeholder.com/300x200" alt="Wide Range" />
            <h3>Wide Range of Venues</h3>
            <p>Find venues tailored to every style and budget.</p>
          </div>
          <div className="feature-card">
            <img src="https://via.placeholder.com/300x200" alt="Pricing" />
            <h3>Transparent Pricing</h3>
            <p>Clear, straightforward pricing with no hidden fees.</p>
          </div>
          <div className="feature-card">
            <img src="https://via.placeholder.com/300x200" alt="Support" />
            <h3>24/7 Support</h3>
            <p>Always available to assist with your booking needs.</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="homepage-footer">
        <p>&copy; 2024 Mahal Booking. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;

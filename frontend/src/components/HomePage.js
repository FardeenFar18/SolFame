// src/pages/HomePage.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import wideRangeImage from '../assets/wide.webp';
import TransparentPricingImage from '../assets/pricing.webp';
import Support from '../assets/24X7.webp';
import './HomePage.css';

const HomePage = () => {
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState("Marriage");
  const [capacity, setCapacity] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [decorStyle, setDecorStyle] = useState("");

  const handleLocationChange = (e) => setLocation(e.target.value);
  const handleEventTypeChange = (e) => setEventType(e.target.value);
  const handleCapacityChange = (e) => setCapacity(e.target.value);
  const handlePriceRangeChange = (e) => setPriceRange(e.target.value);
  const handleDecorStyleChange = (e) => setDecorStyle(e.target.value);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-container">
          <img src={logo} alt="Logo" className="hero-logo" />
          <div className="hero-content">
            <h1>Discover Your Perfect Venue</h1>
            <p>Effortlessly book the ideal mahal for every celebration!</p>
            <Link to="/login" className="hero-btn primary-btn">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <section className="filter-section">
        <h2>Find Your Ideal Wedding Mahal</h2>
        <form className="filter-form">
          {/* Filter options for location, event type, capacity, price range, and decor style */}
          <div className="filter-option">
            <label htmlFor="location">Location:</label>
            <select id="location" value={location} onChange={handleLocationChange}>
              <option value="">Select Location</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
            </select>
          </div>

          <div className="filter-option">
            <label htmlFor="event-type">Event Type:</label>
            <select id="event-type" value={eventType} onChange={handleEventTypeChange}>
              <option value="Marriage">Marriage</option>
              <option value="Reception">Reception</option>
              <option value="Engagement">Engagement</option>
              <option value="Anniversary">Anniversary</option>
            </select>
          </div>

          <div className="filter-option">
            <label htmlFor="capacity">Capacity:</label>
            <select id="capacity" value={capacity} onChange={handleCapacityChange}>
              <option value="">Select Capacity</option>
              <option value="50-100">50-100 guests</option>
              <option value="100-200">100-200 guests</option>
              <option value="200-500">200-500 guests</option>
              <option value="500+">500+ guests</option>
            </select>
          </div>

          <div className="filter-option">
            <label htmlFor="price-range">Price Range:</label>
            <select id="price-range" value={priceRange} onChange={handlePriceRangeChange}>
              <option value="">Select Price Range</option>
              <option value="50000-100000">₹50,000 - ₹1,00,000</option>
              <option value="100000-200000">₹1,00,000 - ₹2,00,000</option>
              <option value="200000-500000">₹2,00,000 - ₹5,00,000</option>
              <option value="500000+">₹5,00,000+</option>
            </select>
          </div>

          <div className="filter-option">
            <label htmlFor="decor-style">Decor Style:</label>
            <select id="decor-style" value={decorStyle} onChange={handleDecorStyleChange}>
              <option value="">Select Decor Style</option>
              <option value="Traditional">Traditional</option>
              <option value="Modern">Modern</option>
              <option value="Royal">Royal</option>
              <option value="Minimalist">Minimalist</option>
            </select>
          </div>

          <button type="submits2" className="filter-btn">Apply Filters</button>
        </form>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Our Key Features</h2>
        <div className="features">
          <div className="feature-card">
            <img src={wideRangeImage} alt="Wide Range" />
            <h3>Wide Range of Venues</h3>
            <p>Find venues tailored to every style and budget.</p>
          </div>
          <div className="feature-card">
            <img src={TransparentPricingImage} alt="Pricing" />
            <h3>Transparent Pricing</h3>
            <p>Clear, straightforward pricing with no hidden fees.</p>
          </div>
          <div className="feature-card">
            <img src={Support} alt="Support" />
            <h3>24/7 Support</h3>
            <p>Always available to assist with your booking needs.</p>
          </div>
        </div>
      </section>

      {/* Footer Section with Register Link */}
      <footer className="homepage-footer">
        <p>&copy; 2024 Mahal Booking. All rights reserved.</p>
        <Link to="/register" className="register-owner-link">
          Register as an Owner
        </Link>
      </footer>
    </div>
  );
};

export default HomePage;

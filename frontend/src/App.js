import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import HallList from "./components/HallLists";
import BookingForm from "./components/BookingForm";
import LoginPage from "./components/LoginPage";
import SignupForm from "./components/SignupPage";
import Dashboard from "./components/Dashboard";
import AdvancedBookingForm from "./components/CreateBooking";
import ViewBookings from "./components/ViewBookings";
import AccountSettings from "./components/Settings";
import VerifyOtp from "./components/OTP-Verify";
import Register from "./components/Register";
import OwnerDashboard from "./components/OwnerDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
    
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/halls" element={<HallList />} />
        <Route path="/book" element={<BookingForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/CreateBooking" element={<AdvancedBookingForm />} />
        <Route path="/ViewBooking" element={<ViewBookings />} />
        <Route path="/Settings" element={<AccountSettings/>} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;

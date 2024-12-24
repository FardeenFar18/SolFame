const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 5002;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Booking Schema and Model
const BookingSchema = new mongoose.Schema({
  customerName: String,
  email: String,
  venue: String,
  eventDate: Date,
  eventType: String,
  numberOfGuests: Number,
  audioSystem: String,
  ledTV: String,
  projectorScreen: String,
  hallCarpet: String,
  stageDecoration: String,
  lighting: String,
  playStation: String,
  ac: String,
  rooms: String,
});

const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

// Route to handle booking creation
app.post("/api/bookings", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json({ message: "Booking created successfully!", booking: newBooking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create booking.", error: err });
  }
});

// Route to fetch all bookings
app.get("/api/bookings", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: "Email is required to filter bookings." });
    }
    const bookings = await Booking.find({ email });
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bookings.", error: err });
  }
});

// Route to update a booking
app.put("/api/bookings/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found." });
    }
    res.status(200).json(updatedBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update booking.", error: err });
  }
});

// Route to fetch statistics
app.get("/api/stats", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: "Email is required to filter stats." });
    }

    const totalBookings = await Booking.countDocuments({ email });
    const pendingApprovals = await Booking.countDocuments({ email, status: "Pending" });
    const upcomingEvents = await Booking.countDocuments({ email, eventDate: { $gte: new Date() } });

    res.status(200).json({
      totalBookings,
      pendingApprovals,
      upcomingEvents
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stats.", error: err });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Booking Service running on http://localhost:${PORT}`));

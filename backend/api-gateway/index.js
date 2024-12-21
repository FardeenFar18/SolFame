const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const PORT = 5000;


app.use(cors({
  origin: 'http://localhost:3000', // allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // specify allowed headers
}));

// Middleware
app.use(express.json());

// Routing requests to respective services
app.use("/auth", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://localhost:5001${req.originalUrl}`,
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error forwarding request to Auth Service." });
  }
});

app.use("/api", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://localhost:5002${req.originalUrl}`,
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error forwarding request to Booking Service." });
  }
});

// Start Server
app.listen(PORT, () => console.log(`API Gateway running on http://localhost:${PORT}`));

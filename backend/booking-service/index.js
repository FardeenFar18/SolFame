const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { IncomingForm } = require('formidable');
const fs = require("fs");

const path = require("path");

const app = express();
const PORT = 5002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));


// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/booking-service", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
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

// File schema and model (storing file metadata)

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

const fileGroupSchema = new mongoose.Schema({
  files: [{
    fileName: String,
    filePath: String,
    fileSize: Number,
  }],
  createdAt: { type: Date, default: Date.now },
});

const FileGroup = mongoose.model('FileGroup', fileGroupSchema);






// Update the `/api/upload-file` endpoint
app.post('/api/upload-file', (req, res) => {
  const form = new IncomingForm({
    multiples: true,
    uploadDir: path.join(__dirname, '/uploads'),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Error uploading files' });
    }

    try {
      const fileMetadata = [];

      // Ensure we're accessing files correctly
      const filePaths = files ? Object.values(files).flat() : [];

      for (const file of filePaths) {
        if (file && file.filepath) {
          // Convert fileName and filePath to Base64
          const base64FileName = Buffer.from(file.originalFilename).toString("base64");
          const base64FilePath = Buffer.from(file.filepath).toString("base64");

          fileMetadata.push({
            fileName: base64FileName, // Store Base64-encoded fileName
            filePath: base64FilePath, // Store Base64-encoded filePath
            fileSize: file.size,
          });
        }
      }

      // Create a new FileGroup document with all file metadata
      const fileGroup = new FileGroup({ files: fileMetadata });
      const savedFileGroup = await fileGroup.save();

      // Return metadata or unique identifiers to the client
      res.status(200).json({
        message: 'Files uploaded successfully',
        fileId: savedFileGroup._id, // Return the MongoDB ObjectId of the saved FileGroup
        fileMetadata, // Include the Base64-converted file metadata in the response
      });

    } catch (error) {
      console.error('Error saving file metadata:', error);
      res.status(500).json({ error: 'Error saving file metadata' });
    }
  });
});



// Start Server
app.listen(PORT, () => console.log(`Booking Service running on http://localhost:${PORT}`));

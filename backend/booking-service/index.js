const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { IncomingForm } = require('formidable');

const path = require("path");

const app = express();
const PORT = 5002;

// Middleware
app.use(cors());
app.use(express.json());

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

    console.log("Parsed files object:", files); // Add this to check the file structure

    try {
      const fileMetadata = [];

      // Ensure we're accessing files correctly, checking if files are in an array or object
      const filePaths = files ? Object.values(files).flat() : [];

      // Collect file metadata
      for (const file of filePaths) {
        console.log('File:', file); // Log each file object to debug

        if (file && file.filepath) {  // Make sure the file object has necessary properties
          fileMetadata.push({
            fileName: file.originalFilename, // Check if it's 'originalFilename' or another key
            filePath: file.filepath,          // Ensure 'filepath' or 'path' is used correctly
            fileSize: file.size,
          });
        } else {
          console.log('File missing expected properties');
        }
      }

      // Create a new FileGroup document with all file metadata
      const fileGroup = new FileGroup({
        files: fileMetadata,  // Store all file metadata in one document
      });

      const savedFileGroup = await fileGroup.save();

      // Send the response with the FileGroup ID
      res.status(200).json({
        message: 'Files uploaded successfully',
        fileGroupId: savedFileGroup._id,  // Single ObjectId for all files
      });

    } catch (error) {
      console.error('Error saving file metadata:', error);
      res.status(500).json({ error: 'Error saving file metadata' });
    }
  });
});



// Start Server
app.listen(PORT, () => console.log(`Booking Service running on http://localhost:${PORT}`));

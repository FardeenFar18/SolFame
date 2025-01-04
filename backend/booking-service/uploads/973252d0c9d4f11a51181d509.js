const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/authApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true },
    role: { type: String, required: true}
  });


const User = mongoose.model('User', userSchema);

const attendanceSchema = new mongoose.Schema({
  email: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date }
});

  
  const Attendance = mongoose.model('Attendance', attendanceSchema);

  
  const leaveRequestSchema = new mongoose.Schema({
    email: String,
    leaveType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Disapproved'], default: 'Pending' },
    approved: { type: Boolean,enum:[false,true], default: false },
    cancelReason: { type: String },
    description: { type: String },
  }, { timestamps: true });
  
  // Create the LeaveRequest model
  const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

  

// Registration endpoint
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password,role } = req.body;
  try {
    const newUser = new User({ name, email, password,role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  });

  app.get('/api/auth/login', async (req, res) => {
    const { email, password } = req.query; // Use req.query to get query parameters
    try {
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  });
  



  app.post('/api/checkin', async (req, res) => {
    const { email } = req.body;
  
    // Ensure email is provided
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
  
    // Check for existing attendance record
    const existingAttendance = await Attendance.findOne({ email, checkOut: null });
    if (existingAttendance) {
      return res.status(400).json({ message: 'User is already checked in.' });
    }
  
    const attendance = new Attendance({ checkIn: new Date(), email });
    try {
      await attendance.save();
      res.json(attendance);
    } catch (error) {
      console.error('Error saving attendance:', error);
      res.status(500).json({ message: 'Failed to save attendance.' });
    }
  });
  

  
  // Check-out endpoint
  app.post('/api/checkout', async (req, res) => {
    const attendance = await Attendance.findOneAndUpdate(
      { checkOut: null }, // Find the latest check-in without a check-out
      { checkOut: new Date() },
      { new: true }
    );
    res.json(attendance);
  });
  


  
  // Leave request endpoint
  app.get('/api/leave-requests', async (req, res) => {
    try {
      const requests = await LeaveRequest.find();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching leave requests' });
    }
  });
  
  app.post('/api/leave-requests', async (req, res) => {
    const {email,leaveType,startDate,endDate,reason} = req.body;
    console.log('Received leave request:', req.body);
    try {
        const leaveRequest = new LeaveRequest({email:email, leaveType:leaveType,startDate:startDate,endDate:endDate,reason:reason});
        await leaveRequest.save();
        res.status(201).json(leaveRequest);
    } catch (error) {
        console.error('Error saving leave request:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

  
  
  
 // Assuming app is your Express instance
app.put('/api/leave-requests/:id/approve', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      { status: 'Approved', approved: true },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Error approving leave request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel a leave request
app.put('/api/leave-requests/:id/cancel', async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body; // Get the cancellation reason from the request body

  try {
    const updatedRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      { status: 'Disapproved', cancelReason: reason, approved:false}, // Update the status and add the cancellation reason
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Error canceling leave request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



  app.get('/api/checkin', async (req, res) => {
    try {
      // Fetch all attendance records
      const attendanceRecords = await Attendance.find();
      res.json(attendanceRecords);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      res.status(500).json({ message: 'Failed to fetch attendance records.' });
    }
  });
  

  
  app.get('/api/checkout', async (req, res) => {
    try {
      const attendance = await Attendance.findOneAndUpdate(
        { checkOut: null },  // Find the latest check-in without a check-out
        { checkOut: new Date() },
        { new: true }
      );
  
      if (!attendance) {
        return res.status(400).json({ message: 'No active check-in found.' });
      }
  
      res.json(attendance);
    } catch (error) {
      console.error('Error during checkout:', error);
      res.status(500).json({ message: 'Failed to check out.' });
    }
  });
  
  
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

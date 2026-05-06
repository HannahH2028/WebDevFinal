// Express server entry point for Unfair Flips backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

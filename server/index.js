// Express server entry point for Unfair Flips backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const gameRoutes = require('./routes/games');
const upgradeRoutes = require('./routes/upgrades');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/games', gameRoutes);
app.use('/api/upgrades', upgradeRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

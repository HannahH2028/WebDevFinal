// Controller for leaderboard CRUD
const Leaderboard = require('../models/Leaderboard');

// @desc    Get top 10 leaderboard entries (sorted by fewest flips)
// @route   GET /api/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const entries = await Leaderboard.find()
      .sort({ totalFlips: 1 })
      .limit(10);
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leaderboard', error: error.message });
  }
};

// @desc    Submit a winning game to the leaderboard
// @route   POST /api/leaderboard
const addToLeaderboard = async (req, res) => {
  try {
    const { playerName, totalFlips, totalMoneyEarned, timeTaken } = req.body;

    if (!playerName || totalFlips == null || totalMoneyEarned == null || timeTaken == null) {
      return res.status(400).json({ message: 'All fields are required: playerName, totalFlips, totalMoneyEarned, timeTaken' });
    }

    const entry = await Leaderboard.create({
      playerName,
      totalFlips,
      totalMoneyEarned,
      timeTaken
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add to leaderboard', error: error.message });
  }
};

module.exports = { getLeaderboard, addToLeaderboard };

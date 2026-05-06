// Routes for leaderboard CRUD
const express = require('express');
const router = express.Router();
const { getLeaderboard, addToLeaderboard } = require('../controllers/leaderboardController');

// GET  /api/leaderboard
router.get('/', getLeaderboard);

// POST /api/leaderboard
router.post('/', addToLeaderboard);

module.exports = router;

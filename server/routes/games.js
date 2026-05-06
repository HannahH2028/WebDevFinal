// Routes for game session CRUD
const express = require('express');
const router = express.Router();
const {
  createGame,
  getGame,
  flipCoin,
  purchaseUpgrade,
  deleteGame
} = require('../controllers/gameController');

// POST   /api/games
router.post('/', createGame);

// GET    /api/games/:id
router.get('/:id', getGame);

// PUT    /api/games/:id/flip
router.put('/:id/flip', flipCoin);

// PUT    /api/games/:id/upgrade
router.put('/:id/upgrade', purchaseUpgrade);

// DELETE /api/games/:id
router.delete('/:id', deleteGame);

module.exports = router;

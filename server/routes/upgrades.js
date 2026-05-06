// Routes for upgrade definitions
const express = require('express');
const router = express.Router();
const { getUpgrades } = require('../controllers/upgradeController');

// GET /api/upgrades
router.get('/', getUpgrades);

module.exports = router;

// Controller for reading upgrade definitions
const Upgrade = require('../models/Upgrade');

// @desc    Get all upgrade definitions
// @route   GET /api/upgrades
const getUpgrades = async (req, res) => {
  try {
    const upgrades = await Upgrade.find();
    res.json(upgrades);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch upgrades', error: error.message });
  }
};

module.exports = { getUpgrades };

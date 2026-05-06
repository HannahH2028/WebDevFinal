// Controller for game session CRUD
const Game = require('../models/Game');
const Upgrade = require('../models/Upgrade');

const COIN_VALUES = [1, 5, 10, 25];
const COIN_NAMES = ['Penny', 'Nickel', 'Dime', 'Quarter'];

// @desc    Create a new game session
// @route   POST /api/games
const createGame = async (req, res) => {
  try {
    const { playerName } = req.body;
    const game = await Game.create({
      playerName: playerName || 'Player'
    });
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create game', error: error.message });
  }
};

// @desc    Get a game session by ID
// @route   GET /api/games/:id
const getGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch game', error: error.message });
  }
};

// @desc    Flip the coin — server-side RNG for fairness
// @route   PUT /api/games/:id/flip
const flipCoin = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.hasWon) {
      return res.status(400).json({ message: 'Game already won! Start a new game.' });
    }

    const roll = Math.random();
    const isHeads = roll < game.headsChance;
    let moneyEarned = 0;

    if (isHeads) {
      game.currentStreak += 1;
      game.totalHeads += 1;


      if (game.currentStreak > game.bestStreak) {
        game.bestStreak = game.currentStreak;
      }

      const streakMultiplier = game.currentStreak + game.streakMultiplierBonus;
      moneyEarned = game.coinValue * streakMultiplier;
      game.money += moneyEarned;


      if (game.currentStreak >= 10) {
        game.hasWon = true;
      }
    } else {

      game.currentStreak = 0;
      moneyEarned = 0;
    }

    game.totalFlips += 1;

    game.flipHistory.push({
      result: isHeads ? 'heads' : 'tails',
      moneyEarned
    });
    if (game.flipHistory.length > 100) {
      game.flipHistory = game.flipHistory.slice(-100);
    }

    await game.save();

    res.json({
      game,
      flipResult: {
        result: isHeads ? 'heads' : 'tails',
        moneyEarned,
        roll: roll.toFixed(4),
        headsChance: game.headsChance
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to flip coin', error: error.message });
  }
};

// @desc    Purchase an upgrade
// @route   PUT /api/games/:id/upgrade
const purchaseUpgrade = async (req, res) => {
  try {
    const { upgradeKey } = req.body;
    if (!upgradeKey) {
      return res.status(400).json({ message: 'upgradeKey is required' });
    }

    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const upgradeDef = await Upgrade.findOne({ key: upgradeKey });
    if (!upgradeDef) {
      return res.status(404).json({ message: 'Upgrade not found' });
    }

    const currentLevel = game.upgradeLevels[upgradeKey] || 0;

    if (currentLevel >= upgradeDef.maxLevel) {
      return res.status(400).json({ message: 'Upgrade already at max level' });
    }

    const cost = Math.round(upgradeDef.baseCost * Math.pow(upgradeDef.costMultiplier, currentLevel));

    if (game.money < cost) {
      return res.status(400).json({ message: 'Not enough money', cost, currentMoney: game.money });
    }

    game.money -= cost;

    const newLevel = currentLevel + 1;
    game.upgradeLevels[upgradeKey] = newLevel;

    switch (upgradeKey) {
      case 'headsChance':
        // Each level adds 7% (0.07), max 90% (starting 20% + 10 × 7% = 90%)
        game.headsChance = 0.20 + (newLevel * upgradeDef.effectPerLevel);
        break;
      case 'coinValue':
        game.coinValue = COIN_VALUES[Math.min(newLevel, COIN_VALUES.length - 1)];
        break;
      case 'multiplier':
        // Each level adds 0.5 to the streak multiplier bonus
        game.streakMultiplierBonus = newLevel * upgradeDef.effectPerLevel;
        break;
      case 'flipSpeed':
        // Each level reduces flip speed by 100ms
        game.flipSpeedMs = 1000 - (newLevel * upgradeDef.effectPerLevel);
        break;
    }

    // Mark upgradeLevels as modified so Mongoose saves the nested object
    game.markModified('upgradeLevels');
    await game.save();

    res.json({
      game,
      upgradePurchased: {
        key: upgradeKey,
        newLevel,
        cost,
        nextCost: newLevel < upgradeDef.maxLevel
          ? Math.round(upgradeDef.baseCost * Math.pow(upgradeDef.costMultiplier, newLevel))
          : null
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to purchase upgrade', error: error.message });
  }
};

// @desc    Delete / reset a game session
// @route   DELETE /api/games/:id
const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete game', error: error.message });
  }
};

module.exports = {
  createGame,
  getGame,
  flipCoin,
  purchaseUpgrade,
  deleteGame,
  COIN_NAMES,
  COIN_VALUES
};

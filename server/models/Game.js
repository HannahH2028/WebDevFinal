//Mongoose model for a game session
const mongoose = require('mongoose');

//the flips
const flipSchema = new mongoose.Schema(
  {
    //result of the flip
    result: {
      type: String,
      enum: ['heads', 'tails'],
      required: true
    },
    //money earned from the flip, defaults to 0 as if landed on tails
    moneyEarned: {
      type: Number,
      default: 0
    }
  }, 
  { 
    _id: false 
  }
);

//for the game itself, tracking player data
const gameSchema = new mongoose.Schema(
  {
    //name for the player
    playerName: {
      type: String,
      default: 'Player',
      trim: true,
      maxlength: 30
    },
    //how much money the player has
    money: {
      type: Number,
      default: 0
    },
    //player's current heads streak, for calculating the money earned and if the win condition has been met
    currentStreak: {
      type: Number,
      default: 0
    },
    //the longest streak the player has had
    bestStreak: {
      type: Number,
      default: 0
    },
    //total times the player has flipped the coin
    totalFlips: {
      type: Number,
      default: 0
    },
    //total times the coin's landed on heads
    totalHeads: {
      type: Number,
      default: 0
    },
    //chance the coin will land on heads, starts at 20%
    headsChance: {
      type: Number,
      default: 0.20
    },
    //baseline amount of money gained per heads, starts at 1 cent (can be upgraded)
    coinValue: {
      type: Number,
      default: 1
    },
    //bonus for the streak multiplier (can be upgraded)
    streakMultiplierBonus: {
      type: Number,
      default: 0
    },
    //length of the flip animation (milliseconds)
    flipSpeedMs: {
      type: Number,
      default: 1000
    },
    //tracks the player's current upgrades as the game goes on
    upgradeLevels: {
      headsChance: { type: Number, default: 0 },
      coinValue: { type: Number, default: 0 },
      multiplier: { type: Number, default: 0 },
      flipSpeed: { type: Number, default: 0 }
    },
    //the player's flip result history for the scrolling display
    flipHistory: [flipSchema],
    //if the player has won
    hasWon: {
      type: Boolean,
      default: false
    }
  }, 
  {
    timestamps: true
  }
);

//putting this in the database
module.exports = mongoose.model('Game', gameSchema);

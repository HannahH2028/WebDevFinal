//Mongoose model for leaderboard entries
const mongoose = require('mongoose');

//leaderboard stuff
const leaderboardSchema = new mongoose.Schema(
  {
    //player name
    playerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30
    },
    //total flips the player has done
    totalFlips: {
      type: Number,
      required: true
    },
    //total money the player earned
    totalMoneyEarned: {
      type: Number,
      required: true
    },
    //time taken to win (seconds)
    timeTaken: {
      type: Number,
      required: true
    },
    //date this was accomplished
    date: {
      type: Date,
      default: Date.now
    }
  }
);

//putting this in the database
module.exports = mongoose.model('Leaderboard', leaderboardSchema);

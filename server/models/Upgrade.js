//Mongoose model for upgrade definitions
const mongoose = require('mongoose');

const upgradeSchema = new mongoose.Schema(
  {
    // key to identify each type of upgrade
    key: {
      type: String,
      required: true,
      unique: true,
      enum: ['headsChance', 'coinValue', 'multiplier', 'flipSpeed']
    },
    //the name displayed for the upgrade
    name: {
      type: String,
      required: true
    },
    //description for each upgrade
    description: {
      type: String,
      required: true
    },
    //base cost for the upgrade
    baseCost: {
      type: Number,
      required: true
    },
    //multiplier for the upgrade cost beyond level 1. basically, cost scaling
    costMultiplier: {
      type: Number,
      required: true
    },
    //max number of times the upgrade can be purchased
    maxLevel: {
      type: Number,
      required: true
    },
    //effect each level of the upgrade provides
    effectPerLevel: {
      type: Number,
      required: true
    },
    //icon identifier for the upgrade
    icon: {
      type: String,
      default: '⬆️'
    }
  }
);

//putting this stuff in the database
module.exports = mongoose.model('Upgrade', upgradeSchema);

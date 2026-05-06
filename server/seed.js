//basically, puts the actual upgrades in the upgrades collection
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Upgrade = require('./models/Upgrade');

//the various upgrades that can be purchased.
//the keys and names should make each self explanatory
const upgrades = [
  {
    key: 'headsChance',
    name: 'Upgrade Heads Chance',
    description: 'Increase the chance the coin will land on heads by 5%',
    baseCost: 5,
    costMultiplier: 5.0,
    maxLevel: 10,
    effectPerLevel: 0.05,
    icon: '🎲' //previously 🎯, if it breaks because of this change it back to the target
  },
  {
    key: 'coinValue',
    name: 'Upgrade Coin',
    description: 'Increase the coin value, letting you earn more with each heads.',
    baseCost: 10,
    costMultiplier: 2.5,
    maxLevel: 3,
    effectPerLevel: 1, //uses lookup table in controller, since it goes up through actual coins (penny, nickel, dime, quarter)
    icon: '🪙'
  },
  {
    key: 'multiplier',
    name: 'Upgrade Streak Multiplier',
    description: 'Boosts the multiplier for consecutive heads. (0.5 per level)',
    baseCost: 10,
    costMultiplier: 2.0,
    maxLevel: 5,
    effectPerLevel: 0.5,
    icon: '🔥'
  },
  {
    key: 'flipSpeed',
    name: 'Upgrade Flip Speed',
    description: 'Faster flips, for the impatient among you. (0.1 sec per level)', //100 ms
    baseCost: 20,
    costMultiplier: 2.0,
    maxLevel: 5,
    effectPerLevel: 100, 
    icon: '⚡'
  }
];

//puts the upgrades in
const seedUpgrades = async () => {
  try {
    await connectDB();
    //clear existing upgrades
    await Upgrade.deleteMany({});
    //put in new definitions
    const created = await Upgrade.insertMany(upgrades);
    console.log(`Seeded ${created.length} upgrade definitions:`);
    created.forEach(u => console.log(`  - ${u.name} (${u.key})`));
    process.exit(0);
  } 
  //error handling
  catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

//calling the function to put this stuff in the collection
seedUpgrades();

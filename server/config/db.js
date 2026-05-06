//MongoDB connection configuration using Mongoose
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/unfair-flips');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } 
  //error handling
  catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

//calling the function to connect it in
module.exports = connectDB;

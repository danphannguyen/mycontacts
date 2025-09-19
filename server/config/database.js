require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("You successfully connected to MongoDB!");
  } catch {
    throw new Error("Can't connect to MongoDB");  
  }
}

module.exports = connectDB;
const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers to prevent Windows querySrv ECONNREFUSED issues with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if restricted in certain environments
}

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('⚠️ MONGO_URI is not defined in your backend/.env file.');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Warning: ${error.message}`);
    console.error('👉 Tip: Check your MONGO_URI in backend/.env and ensure Network Access (0.0.0.0/0) is enabled in MongoDB Atlas.');
  }
};

module.exports = connectDB;


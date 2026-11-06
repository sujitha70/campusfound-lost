const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'CampusLost & Found API', timestamp: new Date() });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.send('🎒 CampusLost & Found API is up and running!');
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err.stack);
  res.status(500).json({
    message: err.message || 'An unexpected server error occurred',
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = Number(PORT) + 1;
    console.warn(`⚠️ Port ${PORT} is already in use. Retrying on port ${nextPort}...`);
    app.listen(nextPort, () => {
      console.log(`🚀 Server successfully running on alternate port ${nextPort}`);
    });
  } else {
    console.error('Server error:', err);
  }
});


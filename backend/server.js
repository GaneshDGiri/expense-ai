const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' })); // Increased limit for Image Uploads
app.use(cors());

// Import Routes
const authRoute = require('./routes/auth');
const transactionsRoute = require('./routes/transactions');
const aiRoute = require('./routes/ai');

// Use Routes
app.use('/api/auth', authRoute);
app.use('/api/transactions', transactionsRoute);
app.use('/api/ai', aiRoute);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
    process.exit(1); // Stop server if DB fails
  });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
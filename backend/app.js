const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Use JSON and URL-encoded middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes from src/routes
const authRoutes = require('./src/routes/authRoutes');

// Basic test route (/) to check server is running
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

// Use routes
app.use('/api', authRoutes);

module.exports = app;

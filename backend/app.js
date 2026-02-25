const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Enable CORS for frontend connectivity
app.use(cors());

// Use JSON and URL-encoded middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes from src/routes
const authRoutes = require('./src/routes/authRoutes');
const companyRoutes = require('./src/routes/company.routes');
const partyRoutes = require('./src/routes/party.routes');

// Basic test route (/) to check server is running
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

// Use routes
app.use('/api', authRoutes);
app.use('/api', companyRoutes);
app.use('/api', partyRoutes);

module.exports = app;

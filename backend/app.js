const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Enable CORS for frontend connectivity
app.use(cors());

// Use JSON and URL-encoded middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes from src/routes
const authRoutes = require('./src/routes/authRoutes');
const companyRoutes = require('./src/routes/company.routes');
const partyRoutes = require('./src/routes/party.routes');
const departmentRoutes = require('./src/routes/department.routes');
const transactionRoutes = require('./src/routes/transaction.routes');
const workRoutes = require('./src/routes/work.routes');

// Basic test route (/) to check server is running
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

// Use routes
app.use('/api', authRoutes);
app.use('/api', companyRoutes);
app.use('/api', partyRoutes);
app.use('/api', departmentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/works', workRoutes);

module.exports = app;

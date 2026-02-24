const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');

// Define register API endpoint
router.post('/register', registerUser);

module.exports = router;

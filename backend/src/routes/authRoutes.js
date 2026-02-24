const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Define register API endpoint
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;

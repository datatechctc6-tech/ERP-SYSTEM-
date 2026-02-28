const express = require('express');
const router = express.Router();
const { registerUser, loginUser, setPin, loginWithPin, getAllUsers } = require('../controllers/authController');

// Define register API endpoint
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/set-pin', setPin);
router.post('/login-pin', loginWithPin);
router.get('/users', getAllUsers);

module.exports = router;

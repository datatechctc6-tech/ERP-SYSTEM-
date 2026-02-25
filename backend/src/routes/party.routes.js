const express = require('express');
const router = express.Router();
const partyController = require('../controllers/party.controller');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/party', verifyToken, partyController.createParty);

module.exports = router;

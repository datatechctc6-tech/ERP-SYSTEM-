const express = require('express');
const router = express.Router();
const partyController = require('../controllers/party.controller');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/party', verifyToken, partyController.createParty);
router.get('/parties', verifyToken, partyController.getParties);
router.put('/party/:id', verifyToken, partyController.updateParty);
router.delete('/party/:id', verifyToken, partyController.deleteParty);

module.exports = router;

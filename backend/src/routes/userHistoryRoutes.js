const express = require('express');
const router = express.Router();
const userHistoryController = require('../controllers/userHistoryController');

router.get('/user-history', userHistoryController.getUserHistory);
router.get('/user-sessions', userHistoryController.getUserSessions);


module.exports = router;

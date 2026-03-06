const express = require('express');
const router = express.Router();
const userHistoryController = require('../controllers/userHistoryController');

router.get('/user-history', userHistoryController.getUserHistory);
router.get('/user-sessions', userHistoryController.getUserSessions);
router.get('/user-attendance', userHistoryController.getAttendance);


module.exports = router;

const express = require('express');
const router = express.Router();
const workController = require('../controllers/work.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, workController.createWork);
router.get('/', authMiddleware, workController.getWorks);
router.put('/:id', authMiddleware, workController.updateWork);
router.delete('/:id', authMiddleware, workController.deleteWork);

module.exports = router;

const express = require('express');
const router = express.Router();
const panchayatController = require('../controllers/panchayat.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, panchayatController.createPanchayat);
router.get('/', authMiddleware, panchayatController.getPanchayats);
router.put('/:id', authMiddleware, panchayatController.updatePanchayat);
router.delete('/:id', authMiddleware, panchayatController.deletePanchayat);

module.exports = router;

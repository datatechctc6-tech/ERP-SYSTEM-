const express = require('express');
const router = express.Router();
const zoneController = require('../controllers/zone.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, zoneController.createZone);
router.get('/', authMiddleware, zoneController.getZones);
router.put('/:id', authMiddleware, zoneController.updateZone);
router.delete('/:id', authMiddleware, zoneController.deleteZone);

module.exports = router;

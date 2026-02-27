const express = require('express');
const router = express.Router();
const partyController = require('../controllers/party.controller');
const verifyToken = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads/gpholdms');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/gp/search', verifyToken, partyController.searchGPs);
router.get('/gp/:id', verifyToken, partyController.getGPById);

router.post('/party', verifyToken, upload.single('photo'), partyController.createParty);
router.get('/parties', verifyToken, partyController.getParties);
router.put('/party/:id', verifyToken, upload.single('photo'), partyController.updateParty);
router.delete('/party/:id', verifyToken, partyController.deleteParty);

module.exports = router;

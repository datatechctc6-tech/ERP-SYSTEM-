const express = require('express');
const router = express.Router();
const { registerCompany, getCompanies } = require('../controllers/companyController');

router.post('/register-company', registerCompany);
router.get('/companies', getCompanies);

module.exports = router;

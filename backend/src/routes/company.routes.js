const express = require('express');
const router = express.Router();
const {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
} = require('../controllers/company.controller');

// Create a new company
router.post('/companies', createCompany);

// Get all companies
router.get('/companies', getCompanies);

// Get a single company by ID
router.get('/companies/:id', getCompanyById);

// Update a company
router.put('/companies/:id', updateCompany);

// Delete a company
router.delete('/companies/:id', deleteCompany);

module.exports = router;

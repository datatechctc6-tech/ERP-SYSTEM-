const CompanyModel = require('../models/companyModel');

const registerCompany = async (req, res) => {
    try {
        const companyData = req.body;

        // Basic validation
        if (!companyData.companyName) {
            return res.status(400).json({ error: 'Company Name is required' });
        }

        const result = await CompanyModel.create(companyData);
        if (!result) {
            return res.status(400).json({ error: 'No valid fields to save' });
        }
        return res.status(201).json({
            message: 'Company registered successfully',
            companyId: result.insertId
        });
    } catch (error) {
        console.error('Company registration error:', error);
        return res.status(500).json({ error: error.message });
    }
};

const getCompanies = async (req, res) => {
    try {
        const companies = await CompanyModel.getAll();
        return res.status(200).json(companies);
    } catch (error) {
        console.error('Fetch companies error:', error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerCompany,
    getCompanies
};

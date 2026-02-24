const CompanyService = require('../services/company.service');

const createCompany = async (req, res) => {
    try {
        const companyData = req.body;

        if (!companyData.companyName) {
            return res.status(400).json({ error: 'Company Name is required' });
        }

        const companyId = await CompanyService.createCompany(companyData);
        return res.status(201).json({
            message: 'Company registered successfully',
            companyId
        });
    } catch (error) {
        console.error('Create company error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

const getCompanies = async (req, res) => {
    try {
        const companies = await CompanyService.getAllCompanies();
        return res.status(200).json(companies);
    } catch (error) {
        console.error('Fetch companies error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

const getCompanyById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ error: 'Company ID is required' });

        const company = await CompanyService.getCompanyById(id);
        if (!company) return res.status(404).json({ error: 'Company not found' });

        return res.status(200).json(company);
    } catch (error) {
        console.error('Get company by id error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

const updateCompany = async (req, res) => {
    try {
        const id = req.params.id;
        const companyData = req.body;

        if (!id) return res.status(400).json({ error: 'Company ID is required' });

        if (companyData.companyName !== undefined && !companyData.companyName) {
            return res.status(400).json({ error: 'Company Name cannot be empty' });
        }

        const updated = await CompanyService.updateCompany(id, companyData);
        if (!updated) return res.status(404).json({ error: 'Company not found or no changes made' });

        return res.status(200).json({ message: 'Company updated successfully' });
    } catch (error) {
        console.error('Update company error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

const deleteCompany = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ error: 'Company ID is required' });

        const deleted = await CompanyService.deleteCompany(id);
        if (!deleted) return res.status(404).json({ error: 'Company not found' });

        return res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
        console.error('Delete company error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

module.exports = {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
};

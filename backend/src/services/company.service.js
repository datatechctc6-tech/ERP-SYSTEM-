const CompanyModel = require('../models/company.model');

class CompanyService {
    static async createCompany(companyData) {
        if (!companyData || Object.keys(companyData).length === 0) {
            throw new Error("No company data provided");
        }
        return await CompanyModel.create(companyData);
    }

    static async getAllCompanies() {
        return await CompanyModel.findAll();
    }

    static async getCompanyById(id) {
        return await CompanyModel.findById(id);
    }

    static async updateCompany(id, companyData) {
        if (!companyData || Object.keys(companyData).length === 0) {
            throw new Error("No valid fields to update");
        }
        const affectedRows = await CompanyModel.update(id, companyData);
        return affectedRows > 0;
    }

    static async deleteCompany(id) {
        const affectedRows = await CompanyModel.delete(id);
        return affectedRows > 0;
    }
}

module.exports = CompanyService;

const db = require('../config/db');

const mapToDB = {
    companyName: 'S_CMP_NM', address1: 'S_ADD1', address2: 'S_ADD2', address3: 'S_ADD3',
    pincode: 'S_PINCODE', country: 'S_COUNTRY', state: 'S_STATE', branchCode: 'S_BRANCH_CODE',
    businessType: 'S_BUSINESS_TYPE', finYearFrom: 'S_FDT', finYearTo: 'S_LDT',
    officeNo: 'S_PHNO1', phoneNo: 'S_PHNO2', whatsappNo: 'S_PHNO3', emailId: 'S_EMAIL_NO',
    password: 'S_SPSWD', website: 'S_WEBSITE', gstin: 'S_GST_NO', tinNo: 'S_TIN_NO',
    dl1: 'S_DL1', dl1From: 'S_DL1_VALID_FROM', dl1To: 'S_DL1_VALID_TO',
    dl2: 'S_DL2', dl2From: 'S_DL2_VALID_FROM', dl2To: 'S_DL2_VALID_TO',
    dl3: 'S_DL3', dl3From: 'S_DL3_VALID_FROM', dl3To: 'S_DL3_VALID_TO',
    fssai: 'S_FSSAI', fssaiFrom: 'S_FSSAI_VALID_FROM', fssaiTo: 'S_FSSAI_VALID_TO',
    bankName: 'S_BANK_NAME', accountNo: 'S_ACNT_NO', ifscCode: 'S_IFSC_NO',
    bankAddress: 'S_BANK_ADDRESS', jurisdiction: 'S_JURISDICTION', workingStyle: 'S_WORK_STYLE',
    narration: 'S_NAR1'
};

class CompanyModel {
    static async create(companyData) {
        const dbFields = [];
        const dbValues = [];

        for (const [key, value] of Object.entries(companyData)) {
            if (mapToDB[key] && value !== '') {
                dbFields.push(mapToDB[key]);
                dbValues.push(value);
            }
        }

        if (dbFields.length === 0) return null;

        const placeholders = dbFields.map(() => '?').join(', ');
        const query = `INSERT INTO _cmp01 (${dbFields.join(', ')}) VALUES (${placeholders})`;
        const [result] = await db.execute(query, dbValues);
        return result;
    }

    static async getAll() {
        // Query getting the relevant fields needed for the table list
        const query = `
            SELECT 
                S_CMP_NM as companyName, 
                S_ADD1 as address1, 
                S_ADD2 as address2, 
                S_BRANCH_CODE as branchCode, 
                S_FDT as finYearFrom, 
                S_LDT as finYearTo, 
                S_BUSINESS_TYPE as businessType, 
                S_GST_NO as gstin 
            FROM _cmp01 
            ORDER BY S_CMP_NM ASC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }
}

module.exports = CompanyModel;

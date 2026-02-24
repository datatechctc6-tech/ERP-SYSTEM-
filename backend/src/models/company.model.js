const db = require('../config/db');

class CompanyModel {
    static mapToDB = {
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

    static async create(companyData) {
        const dbFields = [];
        const dbValues = [];

        for (const [key, value] of Object.entries(companyData)) {
            if (this.mapToDB[key] && value !== '') {
                dbFields.push(this.mapToDB[key]);
                dbValues.push(value);
            }
        }

        if (dbFields.length === 0) return null;

        // Auto-generate S_COMP_SLNO since it might not be AUTO_INCREMENT in the legacy table
        const [maxRes] = await db.execute('SELECT MAX(S_COMP_SLNO) as maxId FROM _cmp01');
        const nextId = (maxRes[0].maxId || 0) + 1;

        dbFields.push('S_COMP_SLNO');
        dbValues.push(nextId);

        const placeholders = dbFields.map(() => '?').join(', ');
        const query = `INSERT INTO _cmp01 (${dbFields.join(', ')}) VALUES (${placeholders})`;
        await db.execute(query, dbValues);

        return nextId;
    }

    static async findAll() {
        const query = `
            SELECT 
                S_COMP_SLNO as id, S_CMP_NM as companyName, S_ADD1 as address1, 
                S_ADD2 as address2, S_ADD3 as address3, S_BRANCH_CODE as branchCode, 
                S_FDT as finYearFrom, S_LDT as finYearTo, S_BUSINESS_TYPE as businessType, 
                S_GST_NO as gstin, S_PINCODE as pincode, S_COUNTRY as country,
                S_STATE as state, S_PHNO1 as officeNo, S_PHNO2 as phoneNo,
                S_PHNO3 as whatsappNo, S_EMAIL_NO as emailId, S_WEBSITE as website,
                S_TIN_NO as tinNo, S_BANK_NAME as bankName, S_ACNT_NO as accountNo,
                S_IFSC_NO as ifscCode, S_BANK_ADDRESS as bankAddress, 
                S_JURISDICTION as jurisdiction, S_WORK_STYLE as workingStyle, S_NAR1 as narration
            FROM _cmp01 
            ORDER BY S_CMP_NM ASC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async findById(id) {
        const selectFields = Object.entries(this.mapToDB).map(([key, dbCol]) => `${dbCol} as '${key}'`).join(', ');
        const query = `
            SELECT S_COMP_SLNO as id, ${selectFields}
            FROM _cmp01 
            WHERE S_COMP_SLNO = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0] || null;
    }

    static async update(id, companyData) {
        const dbFields = [];
        const dbValues = [];

        for (const [key, value] of Object.entries(companyData)) {
            if (this.mapToDB[key]) {
                dbFields.push(`${this.mapToDB[key]} = ?`);
                dbValues.push(value === '' ? null : value);
            }
        }

        if (dbFields.length === 0) return null;

        dbValues.push(id);
        const query = `UPDATE _cmp01 SET ${dbFields.join(', ')} WHERE S_COMP_SLNO = ?`;
        const [result] = await db.execute(query, dbValues);
        return result.affectedRows;
    }

    static async delete(id) {
        const query = `DELETE FROM _cmp01 WHERE S_COMP_SLNO = ?`;
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }
}

module.exports = CompanyModel;

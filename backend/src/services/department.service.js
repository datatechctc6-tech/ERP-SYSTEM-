const db = require('../config/db');

exports.createDepartment = async (departmentData) => {
    try {
        const { DEPT_NAME, DESCRIPTION } = departmentData;

        // Check for duplicate DEPT_NAME
        const [existing] = await db.execute('SELECT DEPT_NAME FROM deptms WHERE DEPT_NAME = ?', [DEPT_NAME]);
        if (existing.length > 0) {
            throw new Error('Department name already exists');
        }

        // Generate DEPT_CODE as integer since schema is INT
        const [maxRow] = await db.execute("SELECT MAX(DEPT_CODE) as maxCode FROM deptms");
        const nextNum = (maxRow[0].maxCode || 0) + 1;

        const query = `
            INSERT INTO deptms (
                DEPT_NAME, DESCRIPTION, DEPT_CODE, T_V_DATE
            ) VALUES (?, ?, ?, CURDATE())
        `;

        const values = [DEPT_NAME, DESCRIPTION || null, nextNum];
        const [result] = await db.execute(query, values);

        return {
            DEPT_CODE: `D${nextNum.toString().padStart(2, '0')}`,
            SL_NO: result.insertId
        };
    } catch (error) {
        throw error;
    }
};

exports.getDepartments = async () => {
    try {
        const query = `
            SELECT SL_NO, DEPT_CODE, DEPT_NAME, DESCRIPTION 
            FROM deptms 
            ORDER BY SL_NO ASC
        `;
        const [rows] = await db.execute(query);

        // Format DEPT_CODE back to D01, D02, etc.
        return rows.map(row => ({
            ...row,
            DEPT_CODE: row.DEPT_CODE ? `D${row.DEPT_CODE.toString().padStart(2, '0')}` : ''
        }));
    } catch (error) {
        throw error;
    }
};

exports.updateDepartment = async (slNo, departmentData) => {
    try {
        const { DEPT_NAME, DESCRIPTION } = departmentData;

        // Validate Duplicate DEPT_NAME excluding this record
        const [existing] = await db.execute('SELECT SL_NO FROM deptms WHERE DEPT_NAME = ? AND SL_NO != ?', [DEPT_NAME, slNo]);
        if (existing.length > 0) {
            throw new Error('Department name already exists');
        }

        const query = `
            UPDATE deptms 
            SET DEPT_NAME = ?, DESCRIPTION = ?, T_V_DATE = CURDATE() 
            WHERE SL_NO = ?
        `;

        const values = [DEPT_NAME, DESCRIPTION || null, slNo];
        const [result] = await db.execute(query, values);

        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

exports.deleteDepartment = async (slNo) => {
    try {
        const [result] = await db.execute('DELETE FROM deptms WHERE SL_NO = ?', [slNo]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

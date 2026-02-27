const db = require('../config/db');

exports.getAllTransactions = async () => {
    try {
        const query = `
            SELECT 
                t.SL_NO AS id,
                d.DEPT_NAME AS department,
                t.DEPT_CODE AS dept_code,
                t.T_V_NO AS amount,
                t.TRANS_DESC AS message,
                t.STATUS AS status,
                t.WORK_CODE,
                t.T_V_DATE AS date,
                p.HOLD_NAME AS partyName,
                p.GP_NAME AS panchayat,
                p.ZONE_NAME AS zone
            FROM trans t
            LEFT JOIN gpholdms p ON t.HOLD_CODE = p.HOLD_CODE
            LEFT JOIN deptms d ON t.DEPT_CODE = d.DEPT_CODE
            ORDER BY t.SL_NO DESC
        `;
        const [rows] = await db.execute(query);
        return rows;
    } catch (error) {
        throw error;
    }
};

exports.getTransactionById = async (id) => {
    try {
        const query = `
            SELECT 
                t.SL_NO AS id,
                d.DEPT_NAME AS department,
                t.DEPT_CODE AS dept_code,
                t.T_V_NO AS amount,
                t.TRANS_DESC AS message,
                t.STATUS AS status,
                t.WORK_CODE,
                t.T_V_DATE AS date,
                p.HOLD_NAME AS partyName,
                p.GP_NAME AS panchayat,
                p.ZONE_NAME AS zone
            FROM trans t
            LEFT JOIN gpholdms p ON t.HOLD_CODE = p.HOLD_CODE
            LEFT JOIN deptms d ON t.DEPT_CODE = d.DEPT_CODE
            WHERE t.SL_NO = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0] || null;
    } catch (error) {
        throw error;
    }
};

exports.createTransaction = async (data) => {
    try {
        const { gp_id, dept_code, amount, message, status, work_code = 1 } = data;

        // Parse DEPT_CODE to integer (e.g., 'D01' -> 1)
        let numericDeptCode = null;
        if (dept_code != null) {
            numericDeptCode = typeof dept_code === 'string' && dept_code.startsWith('D')
                ? parseInt(dept_code.replace('D', ''), 10)
                : parseInt(dept_code, 10);
        }

        const query = `
            INSERT INTO trans (
                DEPT_CODE, 
                T_V_NO, 
                TRANS_DESC, 
                STATUS, 
                HOLD_CODE, 
                WORK_CODE, 
                T_V_DATE
            ) VALUES (?, ?, ?, ?, ?, ?, CURDATE())
        `;
        const values = [numericDeptCode, amount, message || '', status || 'Pending', gp_id, work_code];

        const [result] = await db.execute(query, values);
        return { id: result.insertId, ...data };
    } catch (error) {
        throw error;
    }
};

exports.updateTransaction = async (id, data) => {
    try {
        const { gp_id, dept_code, amount, message, status, work_code } = data;

        // Parse DEPT_CODE to integer
        let numericDeptCode = dept_code;
        if (numericDeptCode != null && typeof numericDeptCode === 'string') {
            numericDeptCode = numericDeptCode.startsWith('D')
                ? parseInt(numericDeptCode.replace('D', ''), 10)
                : parseInt(numericDeptCode, 10);
        }

        let query = 'UPDATE trans SET ';
        const values = [];

        if (numericDeptCode !== undefined) { query += 'DEPT_CODE = ?, '; values.push(numericDeptCode); }
        if (gp_id !== undefined) { query += 'HOLD_CODE = ?, '; values.push(gp_id); }
        if (amount !== undefined) { query += 'T_V_NO = ?, '; values.push(amount); }
        if (message !== undefined) { query += 'TRANS_DESC = ?, '; values.push(message); }
        if (status !== undefined) { query += 'STATUS = ?, '; values.push(status); }
        if (work_code !== undefined) { query += 'WORK_CODE = ?, '; values.push(work_code); }

        if (values.length === 0) {
            return false;
        }

        query = query.slice(0, -2); // Remove last comma and space
        query += ' WHERE SL_NO = ?';
        values.push(id);

        const [result] = await db.execute(query, values);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

exports.deleteTransaction = async (id) => {
    try {
        const query = 'DELETE FROM trans WHERE SL_NO = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

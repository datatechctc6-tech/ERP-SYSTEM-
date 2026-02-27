const db = require('../config/db');

exports.createWork = async (workData) => {
    try {
        const { WORK_NAME, DESCRIPTION } = workData;

        // Check for duplicate WORK_NAME
        const [existing] = await db.execute('SELECT WORK_NAME FROM workms WHERE WORK_NAME = ?', [WORK_NAME]);
        if (existing.length > 0) {
            throw new Error('Work name already exists');
        }

        // Generate WORK_CODE as integer since schema is INT
        const [maxRow] = await db.execute("SELECT MAX(WORK_CODE) as maxCode FROM workms");
        const nextNum = (maxRow[0].maxCode || 0) + 1;

        const query = `
            INSERT INTO workms (
                WORK_NAME, DESCRIPTION, WORK_CODE, T_V_DATE
            ) VALUES (?, ?, ?, CURDATE())
        `;

        const values = [WORK_NAME, DESCRIPTION || null, nextNum];
        const [result] = await db.execute(query, values);

        return {
            WORK_CODE: `WRK${nextNum.toString().padStart(3, '0')}`,
            SL_NO: result.insertId
        };
    } catch (error) {
        throw error;
    }
};

exports.getWorks = async () => {
    try {
        const query = `
            SELECT SL_NO, ID, WORK_CODE, WORK_NAME, DESCRIPTION 
            FROM workms 
            ORDER BY SL_NO ASC
        `;
        const [rows] = await db.execute(query);

        // Format WORK_CODE back to WRK001, WRK002, etc. Note: SL_NO or ID can be used as unique identifier
        return rows.map(row => ({
            ...row,
            WORK_CODE: row.WORK_CODE ? `WRK${row.WORK_CODE.toString().padStart(3, '0')}` : ''
        }));
    } catch (error) {
        // Fallback for ID vs SL_NO based on schema 
        // We know from frontend they use ID || SL_NO
        const [rows] = await db.execute(`
            SELECT *
            FROM workms 
        `);
        return rows.map(row => ({
            ...row,
            WORK_CODE: row.WORK_CODE ? `WRK${row.WORK_CODE.toString().padStart(3, '0')}` : ''
        }));
    }
};

exports.updateWork = async (id, workData) => {
    try {
        const { WORK_NAME, DESCRIPTION } = workData;

        // Determine primary key name dynamically or try ID or SL_NO if needed
        // Assuming primary key or what frontend passes is matched to ID or SL_NO.
        // Let's assume SL_NO is primary based on standard pattern in this app, or ID.
        // First try to check if ID exists in columns
        const [columns] = await db.execute("SHOW COLUMNS FROM workms LIKE 'ID'");
        const primaryKeyCol = columns.length > 0 ? 'ID' : 'SL_NO';

        // Validate Duplicate WORK_NAME excluding this record
        const [existing] = await db.execute(`SELECT ${primaryKeyCol} FROM workms WHERE WORK_NAME = ? AND ${primaryKeyCol} != ?`, [WORK_NAME, id]);
        if (existing.length > 0) {
            throw new Error('Work name already exists');
        }

        const query = `
            UPDATE workms 
            SET WORK_NAME = ?, DESCRIPTION = ?, T_V_DATE = CURDATE() 
            WHERE ${primaryKeyCol} = ?
        `;

        const values = [WORK_NAME, DESCRIPTION || null, id];
        const [result] = await db.execute(query, values);

        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

exports.deleteWork = async (id) => {
    try {
        const [columns] = await db.execute("SHOW COLUMNS FROM workms LIKE 'ID'");
        const primaryKeyCol = columns.length > 0 ? 'ID' : 'SL_NO';

        const [result] = await db.execute(`DELETE FROM workms WHERE ${primaryKeyCol} = ?`, [id]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

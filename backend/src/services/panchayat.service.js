const db = require('../config/db');

exports.createPanchayat = async (panchayatData) => {
    try {
        const { PANCHAYAT_NAME, ZONE_CODE } = panchayatData;

        // Check for duplicate PANCHAYAT_NAME
        const [existing] = await db.execute('SELECT PANCHAYAT_NAME FROM panchayatms WHERE PANCHAYAT_NAME = ?', [PANCHAYAT_NAME]);
        if (existing.length > 0) {
            throw new Error('Panchayat name already exists');
        }

        // Generate PANCHAYAT_CODE as integer since schema is INT
        const [maxRow] = await db.execute("SELECT MAX(PANCHAYAT_CODE) as maxCode FROM panchayatms");
        const nextNum = (maxRow[0].maxCode || 0) + 1;

        const query = `
            INSERT INTO panchayatms (
                PANCHAYAT_NAME, ZONE_CODE, PANCHAYAT_CODE, T_V_DATE
            ) VALUES (?, ?, ?, CURDATE())
        `;

        const values = [PANCHAYAT_NAME, ZONE_CODE || null, nextNum];
        const [result] = await db.execute(query, values);

        return {
            PANCHAYAT_CODE: `PN${nextNum.toString().padStart(3, '0')}`,
            SL_NO: result.insertId
        };
    } catch (error) {
        throw error;
    }
};

exports.getPanchayats = async () => {
    try {
        const query = `
            SELECT SL_NO, ID, PANCHAYAT_CODE, PANCHAYAT_NAME, ZONE_CODE 
            FROM panchayatms 
            ORDER BY SL_NO ASC
        `;
        const [rows] = await db.execute(query);

        return rows.map(row => ({
            ...row,
            PANCHAYAT_CODE: row.PANCHAYAT_CODE ? `PN${row.PANCHAYAT_CODE.toString().padStart(3, '0')}` : ''
        }));
    } catch (error) {
        const [rows] = await db.execute(`
            SELECT *
            FROM panchayatms 
        `);
        return rows.map(row => ({
            ...row,
            PANCHAYAT_CODE: row.PANCHAYAT_CODE ? `PN${row.PANCHAYAT_CODE.toString().padStart(3, '0')}` : ''
        }));
    }
};

exports.updatePanchayat = async (id, panchayatData) => {
    try {
        const { PANCHAYAT_NAME, ZONE_CODE } = panchayatData;

        const [columns] = await db.execute("SHOW COLUMNS FROM panchayatms LIKE 'ID'");
        const primaryKeyCol = columns.length > 0 ? 'ID' : 'SL_NO';

        const [existing] = await db.execute(`SELECT ${primaryKeyCol} FROM panchayatms WHERE PANCHAYAT_NAME = ? AND ${primaryKeyCol} != ?`, [PANCHAYAT_NAME, id]);
        if (existing.length > 0) {
            throw new Error('Panchayat name already exists');
        }

        const query = `
            UPDATE panchayatms 
            SET PANCHAYAT_NAME = ?, ZONE_CODE = ?, T_V_DATE = CURDATE() 
            WHERE ${primaryKeyCol} = ?
        `;

        const values = [PANCHAYAT_NAME, ZONE_CODE || null, id];
        const [result] = await db.execute(query, values);

        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

exports.deletePanchayat = async (id) => {
    try {
        const [columns] = await db.execute("SHOW COLUMNS FROM panchayatms LIKE 'ID'");
        const primaryKeyCol = columns.length > 0 ? 'ID' : 'SL_NO';

        const [result] = await db.execute(`DELETE FROM panchayatms WHERE ${primaryKeyCol} = ?`, [id]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

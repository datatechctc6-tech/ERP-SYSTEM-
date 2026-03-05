const db = require('../config/db');

exports.createZone = async (zoneData) => {
    try {
        const { ZONE_NAME, DESCRIPTION } = zoneData;

        // Check for duplicate ZONE_NAME
        const [existing] = await db.execute('SELECT ZONE_NAME FROM zonems WHERE ZONE_NAME = ?', [ZONE_NAME]);
        if (existing.length > 0) {
            throw new Error('Zone name already exists');
        }

        // Generate ZONE_CODE as integer since schema is INT
        const [maxRow] = await db.execute("SELECT MAX(ZONE_CODE) as maxCode FROM zonems");
        const nextNum = (maxRow[0].maxCode || 0) + 1;

        const query = `
            INSERT INTO zonems (
                ZONE_NAME, DESCRIPTION, ZONE_CODE, T_V_DATE
            ) VALUES (?, ?, ?, CURDATE())
        `;

        const values = [ZONE_NAME, DESCRIPTION || null, nextNum];
        const [result] = await db.execute(query, values);

        return {
            ZONE_CODE: `ZN${nextNum.toString().padStart(3, '0')}`,
            SL_NO: result.insertId
        };
    } catch (error) {
        throw error;
    }
};

exports.getZones = async () => {
    try {
        const query = `
            SELECT SL_NO, ID, ZONE_CODE, ZONE_NAME, DESCRIPTION 
            FROM zonems 
            ORDER BY SL_NO ASC
        `;
        const [rows] = await db.execute(query);

        return rows.map(row => ({
            ...row,
            ZONE_CODE: row.ZONE_CODE ? `ZN${row.ZONE_CODE.toString().padStart(3, '0')}` : ''
        }));
    } catch (error) {
        const [rows] = await db.execute(`
            SELECT *
            FROM zonems 
        `);
        return rows.map(row => ({
            ...row,
            ZONE_CODE: row.ZONE_CODE ? `ZN${row.ZONE_CODE.toString().padStart(3, '0')}` : ''
        }));
    }
};

exports.updateZone = async (id, zoneData) => {
    try {
        const { ZONE_NAME, DESCRIPTION } = zoneData;

        const [columns] = await db.execute("SHOW COLUMNS FROM zonems LIKE 'ID'");
        const primaryKeyCol = columns.length > 0 ? 'ID' : 'SL_NO';

        const [existing] = await db.execute(`SELECT ${primaryKeyCol} FROM zonems WHERE ZONE_NAME = ? AND ${primaryKeyCol} != ?`, [ZONE_NAME, id]);
        if (existing.length > 0) {
            throw new Error('Zone name already exists');
        }

        const query = `
            UPDATE zonems 
            SET ZONE_NAME = ?, DESCRIPTION = ?, T_V_DATE = CURDATE() 
            WHERE ${primaryKeyCol} = ?
        `;

        const values = [ZONE_NAME, DESCRIPTION || null, id];
        const [result] = await db.execute(query, values);

        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

exports.deleteZone = async (id) => {
    try {
        const [columns] = await db.execute("SHOW COLUMNS FROM zonems LIKE 'ID'");
        const primaryKeyCol = columns.length > 0 ? 'ID' : 'SL_NO';

        const [result] = await db.execute(`DELETE FROM zonems WHERE ${primaryKeyCol} = ?`, [id]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

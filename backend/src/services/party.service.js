const db = require('../config/db');

exports.searchGPs = async (keyword) => {
    try {
        const query = `
            SELECT 
                p.HOLD_CODE AS id,
                p.HOLD_NAME AS name,
                p.HOLD_CODE AS hold_code,
                p.photo,
                (SELECT DEPT_CODE FROM trans t WHERE t.HOLD_CODE = p.HOLD_CODE ORDER BY SL_NO DESC LIMIT 1) as dept_code,
                (SELECT d.DEPT_NAME FROM trans t LEFT JOIN deptms d ON t.DEPT_CODE = d.DEPT_CODE WHERE t.HOLD_CODE = p.HOLD_CODE ORDER BY t.SL_NO DESC LIMIT 1) as department_name,
                (SELECT WORK_CODE FROM trans t WHERE t.HOLD_CODE = p.HOLD_CODE ORDER BY SL_NO DESC LIMIT 1) as work_code
            FROM gpholdms p
            WHERE p.HOLD_NAME LIKE ?
            LIMIT 50
        `;
        const [rows] = await db.execute(query, [`%${keyword}%`]);
        return rows;
    } catch (error) {
        throw error;
    }
};

exports.getGPById = async (id) => {
    try {
        const query = `
            SELECT 
                p.*,
                p.HOLD_CODE AS id,
                p.HOLD_NAME AS name,
                p.HOLD_CODE AS hold_code,
                p.photo,
                (SELECT DEPT_CODE FROM trans t WHERE t.HOLD_CODE = p.HOLD_CODE ORDER BY SL_NO DESC LIMIT 1) as dept_code,
                (SELECT d.DEPT_NAME FROM trans t LEFT JOIN deptms d ON t.DEPT_CODE = d.DEPT_CODE WHERE t.HOLD_CODE = p.HOLD_CODE ORDER BY t.SL_NO DESC LIMIT 1) as department_name,
                (SELECT WORK_CODE FROM trans t WHERE t.HOLD_CODE = p.HOLD_CODE ORDER BY SL_NO DESC LIMIT 1) as work_code
            FROM gpholdms p
            WHERE p.HOLD_CODE = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0] || null;
    } catch (error) {
        throw error;
    }
};

exports.createParty = async (partyData) => {
    try {
        const {
            FULL_NAME, ADDRESS, ADDRESS2, STATE, CITY,
            PHONE, WHATSAPP, EMAIL_ID, ZONE, PANCHAYAT,
            DESIGNATION, PARTY_PHOTO, photo
        } = partyData;

        // Get max hold_code to auto-increment it manually
        const [maxRow] = await db.execute('SELECT MAX(HOLD_CODE) as maxCode FROM gpholdms');
        const nextHoldCode = (maxRow[0].maxCode || 0) + 1;

        const query = `
            INSERT INTO gpholdms (
                T_V_DATE, HOLD_NAME, ADDRESS_1, ADDRESS_2, STATE, CITY, 
                MOBILE_NO, WHATSAPP_NO, EMAIL_ID, ZONE_NAME, GP_NAME, 
                DESIGNATION, GP_PHOTO, photo, HOLD_CODE
            ) VALUES (CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            FULL_NAME, ADDRESS || null, ADDRESS2 || null, STATE || null,
            CITY || null, PHONE, WHATSAPP || null, EMAIL_ID, ZONE || null,
            PANCHAYAT || null, DESIGNATION || null, PARTY_PHOTO || null, photo || null, nextHoldCode
        ];

        const [result] = await db.execute(query, values);

        return {
            hold_code: nextHoldCode,
            sl_no: result.insertId
        };
    } catch (error) {
        throw error;
    }
};

exports.getParties = async () => {
    try {
        const query = `
            SELECT 
                SL_NO, HOLD_CODE as id, HOLD_NAME as name, 
                ADDRESS_1 as address, MOBILE_NO as mobile,
                ADDRESS_2 as address2, PINCODE, STATE as state, CITY as city,
                WHATSAPP_NO as whatsapp, EMAIL_ID as email, ZONE_NAME as zone,
                GP_NAME as gramPanchayat, DESIGNATION as designation, photo
            FROM gpholdms
            ORDER BY SL_NO DESC
        `;
        const [rows] = await db.execute(query);
        return rows;
    } catch (error) {
        throw error;
    }
};

exports.updateParty = async (id, partyData) => {
    try {
        const {
            FULL_NAME, ADDRESS, ADDRESS2, STATE, CITY,
            PHONE, WHATSAPP, EMAIL_ID, ZONE, PANCHAYAT,
            DESIGNATION, PARTY_PHOTO, photo
        } = partyData;

        // Build query and values dynamically so we only update photo if provided
        let query = `
            UPDATE gpholdms SET 
                HOLD_NAME = ?, ADDRESS_1 = ?, ADDRESS_2 = ?, STATE = ?, CITY = ?, 
                MOBILE_NO = ?, WHATSAPP_NO = ?, EMAIL_ID = ?, ZONE_NAME = ?, GP_NAME = ?, 
                DESIGNATION = ?, GP_PHOTO = ?, T_V_DATE = CURDATE()
        `;
        const values = [
            FULL_NAME, ADDRESS || null, ADDRESS2 || null, STATE || null,
            CITY || null, PHONE, WHATSAPP || null, EMAIL_ID, ZONE || null,
            PANCHAYAT || null, DESIGNATION || null, PARTY_PHOTO || null
        ];

        if (photo) {
            query += `, photo = ? `;
            values.push(photo);
        }

        query += ` WHERE HOLD_CODE = ?`;
        values.push(id);

        const [result] = await db.execute(query, values);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

exports.deleteParty = async (id) => {
    try {
        const [result] = await db.execute('DELETE FROM gpholdms WHERE HOLD_CODE = ?', [id]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

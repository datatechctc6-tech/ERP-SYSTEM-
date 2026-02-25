const db = require('../config/db');

exports.createParty = async (req, res) => {
    try {
        const {
            FULL_NAME, ADDRESS, ADDRESS2, PINCODE, STATE,
            CITY, PHONE, WHATSAPP, EMAIL_ID, ZONE,
            PANCHAYAT, DESIGNATION, PARTY_PHOTO
        } = req.body;

        if (!FULL_NAME || !PHONE || !PINCODE || !EMAIL_ID) {
            return res.status(400).json({ error: 'FULL_NAME, PHONE, PINCODE and EMAIL_ID are required' });
        }

        // Get max hold_code to auto-increment it manually
        const [maxRow] = await db.execute('SELECT MAX(HOLD_CODE) as maxCode FROM gpholdms');
        const nextHoldCode = (maxRow[0].maxCode || 0) + 1;

        const query = `
            INSERT INTO gpholdms (
                T_V_DATE, HOLD_NAME, ADDRESS_1, ADDRESS_2, STATE, CITY, 
                MOBILE_NO, WHATSAPP_NO, EMAIL_ID, ZONE_NAME, GP_NAME, 
                DESIGNATION, GP_PHOTO, HOLD_CODE
            ) VALUES (CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            FULL_NAME, ADDRESS || null, ADDRESS2 || null, STATE || null,
            CITY || null, PHONE, WHATSAPP || null, EMAIL_ID, ZONE || null,
            PANCHAYAT || null, DESIGNATION || null, PARTY_PHOTO || null, nextHoldCode
        ];

        const [result] = await db.execute(query, values);

        res.status(201).json({
            message: 'Party/Holder created successfully',
            hold_code: nextHoldCode,
            sl_no: result.insertId
        });
    } catch (error) {
        console.error('Error saving party data:', error);
        res.status(500).json({ error: 'Internal server error while saving party data' });
    }
};

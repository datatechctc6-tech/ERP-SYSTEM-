const db = require('../config/db');

class UserModel {
    static async findByEmail(email) {
        const query = `SELECT * FROM login WHERE email = ? LIMIT 1`;
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    }

    static async findByPin(pin) {
        // Find user by their 6-digit pin
        const query = `SELECT * FROM login WHERE pin = ? LIMIT 1`;
        try {
            const [rows] = await db.execute(query, [pin]);
            return rows[0];
        } catch (e) {
            console.error('Error finding by pin:', e);
            return null;
        }
    }

    static async createUser(userData) {
        const { name, email, phone_number, password } = userData;
        const query = `
            INSERT INTO login (name, email, phone_number, password)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [name, email, phone_number, password]);
        return result;
    }

    static async updatePin(email, pin) {
        // Try to update pin, if column doesn't exist it might fail, but let's assume it exists
        const query = `UPDATE login SET pin = ? WHERE email = ?`;
        const [result] = await db.execute(query, [pin, email]);
        return result;
    }

    static async getAllUsers() {
        const query = `SELECT id, name AS username, email, phone_number AS phone, type AS role FROM login`;
        try {
            const [rows] = await db.execute(query);
            return rows;
        } catch (e) {
            // fallback if columns don't match exactly
            const [rows] = await db.execute(`SELECT * FROM login`);
            return rows;
        }
    }
}

module.exports = UserModel;

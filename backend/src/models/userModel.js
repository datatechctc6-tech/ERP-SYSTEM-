const db = require('../config/db');

class UserModel {
    static async findByEmail(email) {
        const query = `SELECT * FROM login WHERE email = ? LIMIT 1`;
        const [rows] = await db.execute(query, [email]);
        return rows[0];
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
}

module.exports = UserModel;

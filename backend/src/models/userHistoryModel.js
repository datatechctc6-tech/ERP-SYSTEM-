const pool = require('../config/db');

class UserHistoryModel {
    static async createTableIfNotExists() {
        const query = `
            CREATE TABLE IF NOT EXISTS user_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                user_name VARCHAR(255),
                action VARCHAR(255) NOT NULL,
                details TEXT,
                ip_address VARCHAR(45),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        try {
            await pool.query(query);
            console.log('✅ user_history table verified/created');
        } catch (error) {
            console.error('❌ Error creating user_history table:', error);
        }
    }

    static async logAction(userId, userName, action, details, ipAddress) {
        const query = `
            INSERT INTO user_history (user_id, user_name, action, details, ip_address)
            VALUES (?, ?, ?, ?, ?)
        `;
        try {
            await pool.query(query, [userId, userName, action, details, ipAddress]);
        } catch (error) {
            console.error('❌ Error logging user action:', error);
        }
    }

    static async getAllHistory() {
        const query = `
            SELECT uh.id, uh.user_id, COALESCE(l.name, uh.user_name) as user_name, 
                   uh.action, uh.details, uh.ip_address, uh.created_at
            FROM user_history uh
            LEFT JOIN login l ON uh.user_id = l.id
            ORDER BY uh.created_at DESC
        `;
        try {
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            console.error('❌ Error fetching user history:', error);
            throw error;
        }
    }
}



// Ensure table exists on initialization
UserHistoryModel.createTableIfNotExists();

module.exports = UserHistoryModel;

const pool = require('../config/db');

class UserSessionModel {
    static async createTableIfNotExists() {
        const query = `
            CREATE TABLE IF NOT EXISTS user_sessions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                logout_time TIMESTAMP NULL,
                ip_address VARCHAR(45),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        try {
            await pool.query(query);
            console.log('✅ table user_sessions verified');
        } catch (error) {
            console.error('❌ Error creating user_sessions table:', error);
        }
    }

    static async startSession(userId, ipAddress) {
        try {
            // Close any existing open sessions for this user first
            await this.endSession(userId);

            const query = `
                INSERT INTO user_sessions (user_id, ip_address)
                VALUES (?, ?)
            `;
            const [result] = await pool.query(query, [userId, ipAddress]);
            return result.insertId;
        } catch (error) {
            console.error('❌ Error starting session:', error);
            throw error;
        }
    }


    static async endSession(userId) {
        // Find the latest open session for this user and close it
        const query = `
            UPDATE user_sessions 
            SET logout_time = CURRENT_TIMESTAMP 
            WHERE user_id = ? AND logout_time IS NULL 
            ORDER BY login_time DESC LIMIT 1
        `;
        try {
            await pool.query(query, [userId]);
        } catch (error) {
            console.error('❌ Error ending session:', error);
            throw error;
        }
    }

    static async getAllSessions() {
        const query = `
            SELECT us.*, l.name as user_name 
            FROM user_sessions us
            LEFT JOIN login l ON us.user_id = l.id
            ORDER BY us.login_time DESC
        `;
        try {
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            console.error('❌ Error fetching sessions:', error);
            throw error;
        }
    }
}

// Initialize table
UserSessionModel.createTableIfNotExists();

module.exports = UserSessionModel;

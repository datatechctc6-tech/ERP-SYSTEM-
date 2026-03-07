const pool = require('../config/db');

class UserAttendanceModel {
    static async createTableIfNotExists() {
        const query = `
            CREATE TABLE IF NOT EXISTS user_attendance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                date DATE NOT NULL,
                status VARCHAR(20) DEFAULT 'Absent',
                first_login TIMESTAMP NULL,
                last_logout TIMESTAMP NULL,
                total_work_ms BIGINT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_user_date (user_id, date)
            )
        `;
        try {
            await pool.query(query);
            console.log('✅ table user_attendance verified');
        } catch (error) {
            console.error('❌ Error creating user_attendance table:', error);
        }
    }

    static async recordLogin(userId, loginTime = new Date()) {
        try {
            const dateStr = loginTime.toISOString().split('T')[0]; // YYYY-MM-DD format
            const timeStr = loginTime.toISOString().slice(0, 19).replace('T', ' ');

            // Insert new record if not exists for today, else do nothing (keep the earliest first_login)
            const query = `
                INSERT INTO user_attendance (user_id, date, status, first_login)
                VALUES (?, ?, 'Present', ?)
                ON DUPLICATE KEY UPDATE id=id
            `;
            await pool.query(query, [userId, dateStr, timeStr]);
        } catch (error) {
            console.error('❌ Error recording login attendance:', error);
            throw error;
        }
    }

    static async recordLogout(userId, logoutTime = new Date()) {
        try {
            const dateStr = logoutTime.toISOString().split('T')[0];
            const timeStr = logoutTime.toISOString().slice(0, 19).replace('T', ' ');

             const updateQuery = `
                UPDATE user_attendance 
                SET last_logout = ?, 
                    total_work_ms = TIMESTAMPDIFF(MICROSECOND, first_login, ?) / 1000
                WHERE user_id = ? AND date = ?
            `;
            await pool.query(updateQuery, [timeStr, timeStr, userId, dateStr]);
             
        } catch (error) {
            console.error('❌ Error recording logout attendance:', error);
            throw error;
        }
    }

    static async getAllAttendance() {
        const query = `
            SELECT ua.*, l.name as user_name 
            FROM user_attendance ua
            LEFT JOIN login l ON ua.user_id = l.id
            ORDER BY ua.date DESC, ua.first_login ASC
        `;
        try {
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            console.error('❌ Error fetching all attendance:', error);
            throw error;
        }
    }
}

// Initialize table
UserAttendanceModel.createTableIfNotExists();

module.exports = UserAttendanceModel;

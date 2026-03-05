const pool = require('./src/config/db');
require('dotenv').config();

async function setup() {
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
        console.log('✅ table user_history created/verified');
        process.exit(0);
    } catch (e) {
        console.error('❌ setup error:', e.message);
        process.exit(1);
    }
}

setup();

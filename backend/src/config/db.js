const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'erpdatatemp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test DB connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connection successful');
        connection.release(); // Release back to pool
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
    }
}

// Call the test function immediately
testConnection();

module.exports = pool;


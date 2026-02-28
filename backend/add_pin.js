require('dotenv').config();
const mysql = require('mysql2/promise');

async function addPinColumn() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3307,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '1234',
        database: process.env.DB_NAME || 'erpdatatemp',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        await pool.execute("ALTER TABLE login ADD COLUMN pin VARCHAR(6) NULL;");
        console.log("Column 'pin' added successfully.");
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log("Column 'pin' already exists.");
        } else {
            console.error("Error adding column:", e);
        }
    }
    process.exit(0);
}

addPinColumn();

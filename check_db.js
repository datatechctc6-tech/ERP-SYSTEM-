const pool = require('./backend/src/config/db');
require('dotenv').config();

async function check() {
    try {
        const [history] = await pool.query('SELECT * FROM user_history');
        console.log('HISTORY_COUNT:', history.length);
        console.log('HISTORY_SAMPLES:', JSON.stringify(history.slice(0, 3), null, 2));

        const [users] = await pool.query('SELECT id, name FROM login');
        console.log('USERS_COUNT:', users.length);
        console.log('USERS_SAMPLES:', JSON.stringify(users.slice(0, 3), null, 2));

        process.exit(0);
    } catch (e) {
        console.error('CHECK_ERROR:', e.message);
        process.exit(1);
    }
}

check();

const db = require('./src/config/db');

async function check() {
    const [rows] = await db.execute('DESCRIBE trans');
    console.log(rows.find(r => r.Field === 'T_V_NO'));
    process.exit(0);
}

check();

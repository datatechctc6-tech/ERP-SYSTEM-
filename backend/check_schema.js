const db = require('./src/config/db');
const fs = require('fs');

async function checkSchema() {
    try {
        const [rows] = await db.execute("SHOW CREATE TABLE workms");
        fs.writeFileSync('schema.txt', rows[0]['Create Table']);
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkSchema();

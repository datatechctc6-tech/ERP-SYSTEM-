const db = require('./src/config/db');

async function modifyPanchayatTable() {
    try {
        console.log("Checking if ZONE_CODE exists in panchayatms...");
        const [columns] = await db.execute("SHOW COLUMNS FROM panchayatms LIKE 'ZONE_CODE'");

        if (columns.length === 0) {
            console.log("Adding ZONE_CODE column to panchayatms...");
            await db.execute("ALTER TABLE panchayatms ADD COLUMN ZONE_CODE varchar(50) DEFAULT NULL AFTER PANCHAYAT_NAME");
            console.log("Added ZONE_CODE successfully");
        } else {
            console.log("ZONE_CODE column already exists");
        }

    } catch (err) {
        console.error("Error modifying table:", err);
    } finally {
        process.exit();
    }
}

modifyPanchayatTable();

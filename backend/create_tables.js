const db = require('./src/config/db');

async function createTables() {
    try {
        console.log("Creating zonems table...");
        await db.execute(`
            CREATE TABLE IF NOT EXISTS \`zonems\` (
              \`SL_NO\` int NOT NULL AUTO_INCREMENT,
              \`T_V_DATE\` date DEFAULT NULL,
              \`ZONE_NAME\` varchar(100) DEFAULT NULL,
              \`DESCRIPTION\` varchar(255) DEFAULT NULL,
              \`ZONE_CODE\` int DEFAULT NULL,
              PRIMARY KEY (\`SL_NO\`),
              UNIQUE KEY \`ZONE_CODE\` (\`ZONE_CODE\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
        `);
        console.log("Creating panchayatms table...");
        await db.execute(`
            CREATE TABLE IF NOT EXISTS \`panchayatms\` (
              \`SL_NO\` int NOT NULL AUTO_INCREMENT,
              \`T_V_DATE\` date DEFAULT NULL,
              \`PANCHAYAT_NAME\` varchar(100) DEFAULT NULL,
              \`DESCRIPTION\` varchar(255) DEFAULT NULL,
              \`PANCHAYAT_CODE\` int DEFAULT NULL,
              PRIMARY KEY (\`SL_NO\`),
              UNIQUE KEY \`PANCHAYAT_CODE\` (\`PANCHAYAT_CODE\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
        `);
        console.log("Tables created successfully");
    } catch (err) {
        console.error("Error creating tables:", err);
    } finally {
        process.exit();
    }
}

createTables();

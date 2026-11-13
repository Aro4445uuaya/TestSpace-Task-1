
require("dotenv").config();

const mysql = require("mysql2/promise");

async function testConnection() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            port: Number(process.env.MYSQL_PORT),
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        console.log("SUCCESS: MySQL connected!");
        console.log("Database:", process.env.MYSQL_DATABASE);

    } catch (error) {
        console.error("MySQL connection failed:", error.message);

    } finally {
        if (connection) await connection.end();
    }
}

testConnection();

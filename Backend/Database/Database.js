require("dotenv").config();
const mysql = require("mysql2/promise");

let db;

async function connectDatabase() {
   if (!db) { // If no connection exists, create one
      try {
         db = await mysql.createConnection({
            host: process.env.MYSQLHOST,
            user: process.env.MYSQLUSER,
            password: process.env.MYSQLPASSWORD,
            database: "dbms_project",
         });

         console.log("✅ Connected to MySQL Database");
      } catch (err) {
         console.error("❌ Error connecting to MySQL:", err);
         process.exit(1);
      }
   }
   return db;
}
connectDatabase();
module.exports = connectDatabase;

// host: process.env.MYSQL_ADDON_HOST,
// port: process.env.MYSQL_ADDON_PORT,
// user: process.env.MYSQL_ADDON_USER,
// password: process.env.MYSQL_ADDON_PASSWORD,
// database: process.env.MYSQL_ADDON_DB

require("dotenv").config();

const mysql = require('mysql2');

// Create connection to the mysql database
const db = mysql.createConnection({
   host: process.env.MYSQL_ADDON_HOST,
   port: process.env.MYSQL_ADDON_PORT,
   user: process.env.MYSQL_ADDON_USER,
   password: process.env.MYSQL_ADDON_PASSWORD,
   database: process.env.MYSQL_ADDON_DB

   // host: process.env.MYSQLHOST,
   // user: process.env.MYSQLUSER,
   // password: process.env.MYSQLPASSWORD,
   // database: 'dbms_project'
});

db.connect((err) => {
   if (err) {
      console.error('Error connecting to MySQL:', err);
      process.exit(1);
   }
   console.log(`✅ Connected to MySQL Database `);
});

module.exports = db;
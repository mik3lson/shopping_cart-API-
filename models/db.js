const mysql = require('mysql2');
require ('dotenv').config(); // Load environment variables from .env file


//Create a direct connection to the MySQL database
// Using environment variables keeps sensitive credentials (host, user, password) out of source code
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost', // Use environment variable or default to localhost
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME 
});


// Establish the database connection immediately when this file is loaded
// Throws an error if connection fails — stops the app to avoid running without DB access
db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected!');
});

module.exports = db;

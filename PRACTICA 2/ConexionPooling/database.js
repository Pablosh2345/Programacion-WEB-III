const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bsd_asistencia',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {pool};

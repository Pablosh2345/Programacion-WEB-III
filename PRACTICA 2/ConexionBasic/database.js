const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bsd_asistencia'
});

// Connect to the database
connection.connect((err) => { 
  if (err) throw err;
  console.log('Connected to MySQL Database!');       
  
});
module.exports = connection;

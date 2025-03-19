const mysql = require('mysql2/promise');


async function main() {
  try {
    // Connect to the database using promises
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'bsd_asistencia'
    });

    connection.connect();
    
    console.log('Connected to MySQL Database!');
    return connection; 
    
  } catch (err) {
    console.error('Error:', err);
  }
}
module.exports = { main };
const mysql = require('mysql-await');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'library-db',
  port: '3306',
});
connection.connect((err) => {
  if (err) {
    console.error('connection error');
    return;
  }
  console.log('connect to mySQL');
});
module.exports = connection;

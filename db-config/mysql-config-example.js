const mysql = require('mysql');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'USER_NAME',
  password: 'PASSWORD_NAME',
  database: 'DATABASE_NAME'
});

module.exports = pool;
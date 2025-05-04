const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'dessert_user',      // MySQL-користувач
  password: 'Prosto13pro-',  //  пароль
  database: 'dessert_delivery',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'         
});

module.exports = pool;

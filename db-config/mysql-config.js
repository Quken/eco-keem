const mysql = require("mysql");
const pool = mysql.createPool({
  host: "195.54.163.42",
  user: "h34471c_All",
  password: "Keem_Kpi",
  database: "h34471c_Work",
  port: "3306",
});

module.exports = pool;

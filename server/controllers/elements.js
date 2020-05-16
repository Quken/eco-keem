const pool = require('../../db-config/mysql-config');

const tableName = 'elements';

const getElements = (req, res) => {
  const columnNames = ['code', 'name', 'short_name', 'measure'];
  const query = `
    SELECT 
      ??
    FROM 
      ??
    ;`;

  const values = [columnNames, tableName];

  return pool.query(query, values, (error, rows) => {
    if (error) {
      return res.status(500).send({
        message: error,
      });
    }

    return res.send(JSON.stringify(rows));
  });
};

module.exports = {
  getElements,
};

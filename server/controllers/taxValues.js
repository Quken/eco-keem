const pool = require('../../db-config/mysql-config');

const tableName = 'tax_values';

const getTaxValues = (req, res) => {
  const query = `
  SELECT 
    *
  FROM 
    ??;
  `;

  const values = [tableName];

  return pool.query(query, values, (error, rows) => {
    if (error) {
      return res.status(500).send({
        message: error,
      });
    }

    if (rows.length) {
      return res.send(JSON.stringify(rows));
    }
  });
};

module.exports = {
  getTaxValues,
};

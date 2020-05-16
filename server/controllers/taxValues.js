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

const addTaxValue = (req, res) => {
  const addEnvironmentPromise = new Promise((resolve, reject) => {
    const query = `
      INSERT INTO
        ??
      VALUES
        (?)
    `;

    pool.query(query, [tableName, Object.values(req.body)], (error, rows) => {
      if (error) {
        reject(error);
      }

      if (rows.affectedRows === 1) {
        resolve();
      }
    });
  });

  return addEnvironmentPromise
    .then(() => res.sendStatus(200))
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports = {
  getTaxValues,
  addTaxValue,
};

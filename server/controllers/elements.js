const pool = require('../../db-config/mysql-config');

const tableName = 'elements';

const getElements = (req, res) => {
  const query = `
    SELECT 
      *
    FROM 
      ??
    ;`;

  const values = [tableName];

  return pool.query(query, values, (error, rows) => {
    if (error) {
      return res.status(500).send({
        message: error,
      });
    }

    return res.send(JSON.stringify(rows));
  });
};

const addElement = (req, res) => {
  const addElementPromise = new Promise((resolve, reject) => {
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

  return addElementPromise
    .then(() => res.sendStatus(200))
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports = {
  getElements,
  addElement,
};

const pool = require('../../db-config/mysql-config');

const tableName = 'gdk';

const findGdkElement = (req, res) => {
  const { code, environment } = req.body;

  const columnNames = ['mpc_m_ot', 'mpc_avrg_d'];
  const query = `
    SELECT 
      ??
    FROM 
      ??
    WHERE 
      ?? = ?
    AND
      ?? = ?
    ;`;

  const values = [
    columnNames,
    tableName,
    'code',
    code,
    'environment',
    environment,
  ];

  return pool.query(query, values, (error, rows) => {
    if (error) {
      return res.status(500).send({
        message: error,
      });
    }

    if (!!rows[0]) {
      const response = {
        average: rows[0].mpc_avrg_d,
        max: rows[0].mpc_m_ot,
      };

      return res.send(JSON.stringify(response));
    } else {
      return res.send({});
    }
  });
};

const getAllGdkElements = (req, res) => {
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

const addGdkElement = (req, res) => {
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
  addGdkElement,
  findGdkElement,
  getAllGdkElements,
};

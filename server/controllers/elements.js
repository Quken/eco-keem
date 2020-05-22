const pool = require('../../db-config/mysql-config');

const tableName = 'elements';

const getElements = async (req, res) => {
  const getElementsPromise = new Promise((resolve, reject) => {
    const query = `
      SELECT 
        *
      FROM 
        ??
      ;`;

    const values = [tableName];

    return pool.query(query, values, (error, rows) => {
      if (error) {
        reject(error);
      }

      resolve(rows);
    });
  });

  try {
    const rows = await getElementsPromise;
    return res.send(JSON.stringify(rows));
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const addElement = async (req, res) => {
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

  try {
    await addElementPromise;
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

module.exports = {
  getElements,
  addElement,
};

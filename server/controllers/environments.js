const pool = require('../../db-config/mysql-config');

const tableName = 'environment';

const getEnvironments = async (req, res) => {
  const getEnvironmentsPromise = new Promise((resolve, reject) => {
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
    const rows = await getEnvironmentsPromise;
    return res.send(JSON.stringify(rows));
  } catch (error) {
    return res.status(500).send({
      message: error,
    });
  }
};

const addEnvironment = async (req, res) => {
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

  try {
    await addEnvironmentPromise;
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

module.exports = {
  getEnvironments,
  addEnvironment,
};

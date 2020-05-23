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

const getAllGdkElements = async (req, res) => {
  const getAllElementsPromise = new Promise((resolve, reject) => {
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
    const rows = await getAllElementsPromise;
    return res.send(JSON.stringify(rows));
  } catch (error) {
    return res.status(500).send({
      message: error,
    });
  }
};

const addGdkElement = async (req, res) => {
  const addGdkElementPromise = new Promise((resolve, reject) => {
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
    await addGdkElementPromise;
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

// !!comparison only by `code` (without `environment`)!!
const editGdkElement = async (req, res) => {
  // TODO
  // id in params should also change after editing on frontend
  // (we should use new id for put when it has changed)

  const editGdkElementPromise = new Promise((resolve, reject) => {
    const id = req.params.id;
    const { body: updatedValues } = req;

    const query = `
      UPDATE
      ??
      SET
      ?
      WHERE
      ?? = ?
    `;

    const values = [tableName, updatedValues, 'code', id];

    pool.query(query, values, (error, rows) => {
      if (error) {
        reject(error);
      }

      if (rows.affectedRows === 1) {
        resolve();
      }
    });
  });

  try {
    await editGdkElementPromise;
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

// !!comparison only by `code` (without `environment`)!!
const removeGdkElement = async (req, res) => {
  const removeGdkElementPromise = new Promise((resolve, reject) => {
    const id = req.params.id;

    const query = `
      DELETE FROM
      ??
      WHERE
      ?? = ?
    `;

    const values = [tableName, 'code', id];

    pool.query(query, values, (error, rows) => {
      if (error) {
        reject(error);
      }

      if (rows.affectedRows === 1) {
        resolve();
      }
    });
  });

  try {
    await removeGdkElementPromise;
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

module.exports = {
  addGdkElement,
  findGdkElement,
  getAllGdkElements,
  editGdkElement,
  removeGdkElement,
};

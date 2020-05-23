const pool = require('../../db-config/mysql-config');

const tableName = 'type_of_object';

const getTypes = async (req, res) => {
  const getTypesPromise = new Promise((resolve, reject) => {
    const query = `
      SELECT 
        ??
      FROM 
        ??;
      `;

    const values = [['Id', 'Name', 'Image_Name'], 'type_of_object'];

    return pool.query(query, values, (error, rows) => {
      if (error) {
        reject(error);
      }

      resolve(rows);
    });
  });

  try {
    const rows = await getTypesPromise;
    const mappedTypes = rows.map(({ Id, Name, Image_Name }) => {
      return {
        id: Id,
        name: Name,
        imageName: Image_Name,
      };
    });

    return res.send(JSON.stringify(mappedTypes));
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const addType = async (req, res) => {
  const addTypeOfObjectPromise = new Promise((resolve, reject) => {
    const query = `
      INSERT INTO
        ??
        (??)
      VALUES
        (?)
    `;

    const columns = ['Id', 'Name', 'Image_Name'];

    pool.query(
      query,
      [tableName, columns, Object.values(req.body)],
      (error, rows) => {
        if (error) {
          reject(error);
        }

        if (rows.affectedRows === 1) {
          resolve();
        }
      }
    );
  });

  try {
    await addTypeOfObjectPromise;
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const editTypeOfObject = async (req, res) => {
  // TODO
  // id in params should also change after editing on frontend
  // (we should use new id for put when it has changed)

  const editTypeOfObjectPromise = new Promise((resolve, reject) => {
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

    const values = [tableName, updatedValues, 'Id', id];

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
    await editTypeOfObjectPromise;
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

module.exports = {
  getTypes,
  addType,
  editTypeOfObject,
};

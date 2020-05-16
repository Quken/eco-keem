const pool = require('../../db-config/mysql-config');

const tableName = 'type_of_object';

const getTypes = (req, res) => {
  const query = `
  SELECT 
    ??
  FROM 
    ??;
  `;

  const values = [['Id', 'Name', 'Image_Name'], 'type_of_object'];

  return pool.query(query, values, (error, rows) => {
    if (error) {
      return res.status(500).send({
        message: error,
      });
    }

    if (rows.length) {
      const mappedTypes = rows.map(({ Id, Name, Image_Name }) => {
        return {
          id: Id,
          name: Name,
          imageName: Image_Name,
        };
      });

      return res.send(JSON.stringify(mappedTypes));
    }
  });
};

const addType = (req, res) => {
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

  return addTypeOfObjectPromise
    .then(() => res.sendStatus(200))
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports = {
  getTypes,
  addType,
};

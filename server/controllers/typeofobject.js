const pool = require('../../db-config/mysql-config');

const getTypes = (req, res) => {
  const query = `
  SELECT 
    ??
  FROM 
    ??;
  `;

  const values = [['Id', 'Name'], 'type_of_object'];

  return pool.query(query, values, (error, rows) => {
    if (error) {
      return res.status(500).send({
        message: error,
      });
    }

    if (rows.length) {
      const mappedTypes = rows.map(({ Id, Name }) => {
        return {
          id: Id,
          name: Name,
        };
      });

      return res.send(JSON.stringify(mappedTypes));
    }
  });
};

module.exports = {
  getTypes,
};

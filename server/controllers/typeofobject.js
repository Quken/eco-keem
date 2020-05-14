const pool = require('../../db-config/mysql-config');

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

module.exports = {
  getTypes,
};

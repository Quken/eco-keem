const pool = require('../../db-config/mysql-config');

const tableName = 'emissions_on_map';
const SOURCE_POI = 'poi';
const SOURCE_POLYGON = 'polygon';

const insertEmissionOnMap = (source, emission) => {
  const { idPoi, idElement, idEnvironment, valueAvg, valueMax, idPolygon, year, month, day, measure } = emission;
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO 
        ??
        (??)
      VALUES
        (?)`;

    const columnNames = ['idElement', 'idEnvironment', 'ValueAvg', 'ValueMax', 'Year', 'Month', 'day', 'Measure'];
    const values = [idElement, idEnvironment, valueAvg, valueMax, year, month, day, measure];
    if (source === SOURCE_POI) {
      columnNames.push('idPoi');
      values.push(idPoi);
    } else if (source === SOURCE_POLYGON) {
      columnNames.push('idPoligon');
      values.push(idPolygon);
    }

    const parameters = [tableName, columnNames, values];
    pool.query(query, parameters, (error) => {
      if (error) {
        reject(error);
      }

      resolve();
    })
  });
};

const getEmissionsOnMap = (source, id) => {
  let filteringColumnName;
  if (source === SOURCE_POI) {
    filteringColumnName = 'idPoi';
  } else if (source === SOURCE_POLYGON) {
    filteringColumnName = 'idPoligon';
  }

  return new Promise((resolve, reject) => {
    const emissionsOnMapTable = 'emissions_on_map';
    const columnNames = ['idElement', 'idEnvironment', 'ValueAvg', 'ValueMax', 'Year', 'Month', 'day', 'emissions_on_map.Measure', 'elements.short_name', 'environment.name'];
    const query = `
      SELECT
      ??
      FROM
      ??
      INNER JOIN
        elements
      ON
        elements.code = emissions_on_map.idElement
      INNER JOIN environment
      ON
        environment.id = emissions_on_map.idEnvironment
      WHERE
        ?? = ?`;
    const values = [columnNames, emissionsOnMapTable, filteringColumnName, id];
    pool.query(query, values, (error, rows) => {
      if (error) {
        reject(error);
      }

      resolve(rows);
    });
  });
};

module.exports = {
  insertEmissionOnMap,
  SOURCE_POI,
  SOURCE_POLYGON,
  getEmissionsOnMap,
};

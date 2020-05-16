const path = require('path');
const express = require('express');
const router = express.Router();

const authController = require('./controllers/auth');
const polygonsController = require('./controllers/polygons');
const pointsController = require('./controllers/points');
const pointController = require('./controllers/point');
const typeOfObjectController = require('./controllers/typeofobject');
const expertsController = require('./controllers/experts');
const environmentsController = require('./controllers/environments');
const elementsController = require('./controllers/elements');
const gdkController = require('./controllers/gdk');
const emissionsCalculationsController = require('./controllers/emissionsCalculations');
const ownerTypesController = require('./controllers/ownerTypes');
const taxValuesController = require('./controllers/taxValues');

router.post('/login', authController.login);

router.get('/polygons', polygonsController.getPolygons);
router.post('/polygon', polygonsController.addPolygon);
router.get('/polygon/:id', polygonsController.getPolygon);
router.put('/polygon/:id', polygonsController.updatePolygon);

router.get('/points', pointsController.getPoints);

router.post('/point', pointController.addPoint);
router.get('/point/:id', pointController.getPoint);
router.put('/point/:id', pointController.updatePoint);

router.get('/typeofobjects', typeOfObjectController.getTypes);
router.post('/typeofobjects', typeOfObjectController.addType);

router.get('/experts', expertsController.getExperts);

router.get('/environments', environmentsController.getEnvironments);
router.post('/environments', environmentsController.addEnvironment);

router.get('/elements', elementsController.getElements);
router.post('/elements', elementsController.addElement);

router.get('/gdk', gdkController.getAllGdkElements);
router.post('/gdk', gdkController.addGdkElement);
router.post('/gdk/find', gdkController.findGdkElement);

router.get(
  '/emissionscalculations',
  emissionsCalculationsController.getEmissionsCalculations
);

router.get('/ownertypes', ownerTypesController.getAll);

router.get('/taxvalues', taxValuesController.getTaxValues);
router.post('/taxvalues', taxValuesController.addTaxValue);

if (process.env.NODE_ENV === 'production') {
  router.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

module.exports = router;

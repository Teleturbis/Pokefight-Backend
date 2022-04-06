import express from 'express';
import adminController from '../controller/admin';
// ...rest of the initial code omitted for simplicity.
import { body, param } from 'express-validator';
import validate from '../js/validate';

const routesAdmin = express.Router();

routesAdmin.get('/', adminController.showPage);
routesAdmin.get('/startSimulation', adminController.startSimulation);
routesAdmin.get('/stopSimulation', adminController.stopSimulation);

export { routesAdmin };

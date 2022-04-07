import express from 'express';
import controller from '../controller/admin';
// ...rest of the initial code omitted for simplicity.
import { body, param } from 'express-validator';
import validate from '../js/validate';

const routesAdmin = express.Router();

routesAdmin.get('/', controller.showPage);
routesAdmin.get('/startSimulation', controller.startSimulation);
routesAdmin.get('/stopSimulation', controller.stopSimulation);
routesAdmin.get('/tic/:time', controller.setTicInterval);
routesAdmin.get('/sim/:time', controller.setSimInterval);

export { routesAdmin };

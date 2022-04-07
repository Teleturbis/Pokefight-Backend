import express from 'express';
// ...rest of the initial code omitted for simplicity.
import { body, param } from 'express-validator';
import validate from '../js/validate';

// import itemController from '../controller/item';
import controllerBase from '../controller/controllerBase';
import ServiceBase from '../service/serviceBase';
import schema from '../model/item';

const routesItem = express.Router();

routesItem.post(
  '/',
  validate([body('name').exists().withMessage('No data found')]),
  controllerBase.create(new ServiceBase(), schema)
);

routesItem.get('/', controllerBase.get(new ServiceBase(), schema));

routesItem.get(
  '/:id',
  validate([param('id').isString()]),
  controllerBase.getById(new ServiceBase(), schema)
);

routesItem.delete(
  '/:id',
  validate([param('id').isString()]),
  // itemController.deleteItem
  controllerBase.deleteById(new ServiceBase(), schema)
);

// routesItem.get(
//   '/:id/:info',
//   validate([param('id').isString()]),
//   validate([param('info').exists()]),
//   itemController.getItemInfo
// );

// routesItem.post(
//   '/',
//   validate([body('name').exists().withMessage('No data found')]),
//   itemController.createItem
// );

// routesItem.put(
//   '/:id',
//   validate([
//     param('id').isString(),
//     body('price').isNumeric().withMessage('Price must be a number'),
//   ]),
//   itemController.editItem
// );

export { routesItem };

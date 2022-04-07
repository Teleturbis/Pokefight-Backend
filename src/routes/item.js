import express from 'express';
// ...rest of the initial code omitted for simplicity.
import { body, param } from 'express-validator';
import validate from '../js/validate';

import controller from '../controller/item';
import service from '../service/item';
import schema from '../model/item';

const routesItem = express.Router();

routesItem.post(
  '/',
  validate([body('name').exists().withMessage('No data found')]),
  controller.create(service, schema)
);

routesItem.get('/', controller.get(service, schema));

routesItem.get(
  '/:id',
  validate([param('id').isString()]),
  controller.getById(service, schema)
);

routesItem.delete(
  '/:id',
  validate([param('id').isString()]),
  // itemController.deleteItem
  controller.deleteById(service, schema)
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

import express from 'express';
// ...rest of the initial code omitted for simplicity.
import { body, param } from 'express-validator';
import validate from '../js/validate';

import characterController from '../controller/character';
import controllerBase from '../controller/controllerBase';
import ServiceBase from '../service/serviceBase';
import schema from '../model/character';

const routesCharacter = express.Router();

routesCharacter.post(
  '/',
  validate([body('name').exists().withMessage('No data found')]),
  characterController.createCharacter
);

routesCharacter.get('/', controllerBase.get(new ServiceBase(), schema));

routesCharacter.get(
  '/:id',
  validate([param('id').isString()]),
  controllerBase.getById(new ServiceBase(), schema)
);

routesCharacter.delete(
  '/:id',
  validate([param('id').isString()]),
  // itemController.deleteItem
  controllerBase.deleteById(new ServiceBase(), schema)
);

routesCharacter.get(
  '/user/:id',
  validate([param('id').isString()]),
  characterController.getUserCharacter
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

export { routesCharacter };

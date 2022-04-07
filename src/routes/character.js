import express from 'express';
// ...rest of the initial code omitted for simplicity.
import { body, param } from 'express-validator';
import validate from '../js/validate';

import controller from '../controller/character';
import service from '../service/character';
import schema from '../model/character';

const routesCharacter = express.Router();

routesCharacter.post(
  '/',
  validate([body('name').exists().withMessage('No data found')]),
  controller.createCharacter
);

routesCharacter.get('/', controller.get(service, schema));

routesCharacter.get(
  '/:id',
  validate([param('id').isString()]),
  controller.getById(service, schema)
);

routesCharacter.delete(
  '/:id',
  validate([param('id').isString()]),
  // itemController.deleteItem
  controller.deleteById(service, schema)
);

routesCharacter.post(
  '/:id/addPokemon/:pokemonId',
  validate([param('id').isString(), param('pokemonId').isString()]),
  controller.addPokemon
);

routesCharacter.post(
  '/:id/removePokemon/:pokemonId',
  validate([param('id').isString(), param('pokemonId').isString()]),
  controller.removePokemon
);

routesCharacter.post(
  '/:id/addItem/:itemId',
  validate([param('id').isString(), param('itemId').isString()]),
  controller.addItem
);

routesCharacter.post(
  '/:id/useItem/:itemId',
  validate([param('id').isString(), param('itemId').isString()]),
  controller.useItem
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

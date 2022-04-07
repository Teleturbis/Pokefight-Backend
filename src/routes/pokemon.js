import express from 'express';
// ...rest of the initial code omitted for simplicity.
import { body, param } from 'express-validator';
import validate from '../js/validate';

import controller from '../controller/pokemon';
import service from '../service/pokemon';
import schema from '../model/pokemon';

const routesPokemon = express.Router();

routesPokemon.post(
  '/',
  validate([body('name').exists().withMessage('No data found')]),
  controller.create(service, schema)
);

routesPokemon.get('/', controller.get(service, schema));

routesPokemon.get(
  '/:id',
  validate([param('id').isString()]),
  controller.getById(service, schema)
);

routesPokemon.get(
  '/:id/:info',
  validate([param('id').isString()]),
  validate([param('info').exists()]),
  controller.getPokemonInfo
);

routesPokemon.delete(
  '/:id',
  validate([param('id').isString()]),
  controller.deleteById(service, schema)
);

// routesPokemon.put(
//   '/:id',
//   validate([
//     param('id').isString(),
//     body('price').isNumeric().withMessage('Price must be a number'),
//   ]),
//   pokemonController.editPokemon
// );

export { routesPokemon };

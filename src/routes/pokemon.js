import express from 'express';
import pokemonController from '../controller/pokemon';
// ...rest of the initial code omitted for simplicity.
import { body, param } from 'express-validator';
import validate from '../js/validate';

const routesPokemon = express.Router();

routesPokemon.get('/', pokemonController.getPokemons);

routesPokemon.get(
  '/:id',
  validate([param('id').isString()]),
  pokemonController.getPokemon
);

routesPokemon.get(
  '/:id/:info',
  validate([param('id').isString()]),
  validate([param('info').exists()]),
  pokemonController.getPokemonInfo
);

routesPokemon.delete(
  '/:id',
  validate([param('id').isString()]),
  pokemonController.deletePokemon
);

routesPokemon.post(
  '/',
  validate([body('name').exists().withMessage('No data found')]),
  pokemonController.createPokemon
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

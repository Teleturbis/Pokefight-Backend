import express from 'express';
import pokemonController from '../controller/pokemon';
// ...rest of the initial code omitted for simplicity.
import { body, param } from 'express-validator';
import validate from '../js/validate';

const routesPokemon = express.Router();

routesPokemon.get('/', pokemonController.getPokemons);

routesPokemon.get(
  '/:id',
  validate([param('id').isNumeric()]),
  pokemonController.getPokemon
);

routesPokemon.get(
  '/:id/:info',
  validate([param('id').isNumeric()]),
  validate([param('info').exists()]),
  pokemonController.getPokemonInfo
);

// routesPokemon.post(
//   '/',
//   validate([body('price').isNumeric().withMessage('Price must be a number')]),
//   pokemonController.createPokemon
// );

// routesPokemon.put(
//   '/:id',
//   validate([
//     param('id').isNumeric(),
//     body('price').isNumeric().withMessage('Price must be a number'),
//   ]),
//   pokemonController.editPokemon
// );

// routesPokemon.delete(
//   '/:id',
//   validate([param('id').isNumeric()]),
//   pokemonController.deletePokemon
// );

export { routesPokemon };

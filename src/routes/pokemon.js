import express from 'express';
// ...rest of the initial code omitted for simplicity.
import { body, param } from 'express-validator';
import validate from '../js/validate';

import controller from '../controller/pokemon';
import service from '../service/pokemon';
import schema from '../model/pokemon';
import BaseRouter from './routes-base';

const baseRouter = new BaseRouter(controller, service, schema);
const routes = baseRouter.routes;

baseRouter
  .addCreateDefault(
    validate([body('name').exists().withMessage('body data invalid')])
  )
  .addGetAllDefault()
  .addGetByIdDefault()
  .addEditDefault(
    validate([body('name').exists().withMessage('body data invalid')])
  )
  .addDeleteDefault();

routes.get(
  '/:id/:info',
  validate([param('id').isString()]),
  validate([param('info').exists()]),
  controller.getPokemonInfo
);

// routesPokemon.put(
//   '/:id',
//   validate([
//     param('id').isString(),
//     body('price').isNumeric().withMessage('Price must be a number'),
//   ]),
//   pokemonController.editPokemon
// );

export { routes as routesPokemon };

import express from 'express';
// ...rest of the initial code omitted for simplicity.
import { body, param } from 'express-validator';
import validate from '../js/validate';

import controller from '../controller/character';
import service from '../service/character';
import schema from '../model/character';
import BaseRouter from './routes-base';

const baseRouter = new BaseRouter(controller, service, schema);
const routes = baseRouter.routes;

const validateBody = validate([
  body('name').exists().withMessage('body data invalid'),
]);

// ! bind(service) to the callback-Function, otherwise big problems with the this-reference
baseRouter
  .addCreateDefault(validateBody, service.checkData.bind(service))
  .addGetAllDefault()
  .addGetByIdDefault()
  .addEditDefault(validateBody, service.checkData.bind(service))
  .addDeleteDefault();

routes.post(
  '/:id/addPokemon/:pokemonId',
  validate([param('id').isString(), param('pokemonId').isString()]),
  controller.addPokemon
);

routes.post(
  '/:id/removePokemon/:pokemonId',
  validate([param('id').isString(), param('pokemonId').isString()]),
  controller.removePokemon
);

routes.post(
  '/:id/changeHpPokemon/:pokemonId/:amount',
  validate([
    param('id').isString(),
    param('pokemonId').isString(),
    param('amount').isNumeric().withMessage('Amount must be a number'),
  ]),
  controller.changeHpPokemon
);

routes.post(
  '/:id/addItem/:itemId',
  validate([param('id').isString(), param('itemId').isString()]),
  controller.addItem
);

routes.post(
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

export { routes as routesCharacter };

import express from 'express';
// ...rest of the initial code omitted for simplicity.
import { body, param } from 'express-validator';
import validate from '../js/validate';

import controller from '../controller/item';
import service from '../service/item';
import schema from '../model/item';
import BaseRouter from './routes-base';

const baseRouter = new BaseRouter(controller, service, schema);
const routes = baseRouter.routes;

baseRouter
  .addPostDefault(
    validate([body('name').exists().withMessage('body data invalid')])
  )
  .addGetAllDefault()
  .addGetByIdDefault()
  .addDeleteDefault();

// routesItem.put(
//   '/:id',
//   validate([
//     param('id').isString(),
//     body('price').isNumeric().withMessage('Price must be a number'),
//   ]),
//   itemController.editItem
// );

export { routes as routesItem };

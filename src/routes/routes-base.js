import express from 'express';
import { body, param } from 'express-validator';
import validate from '../js/validate';

class BaseRouter {
  constructor(controller, service, schema) {
    this.routes = express.Router();
    this.controller = controller;
    this.service = service;
    this.schema = schema;
  }

  addPostDefault(validations = () => next()) {
    this.routes.post(
      '/',
      validations,
      this.controller.create(this.service, this.schema)
    );
    return this;
  }

  addGetAllDefault() {
    this.routes.get('/', this.controller.get(this.service, this.schema));
    return this;
  }

  addGetByIdDefault() {
    this.routes.get(
      '/:id',
      validate([param('id').isString()]),
      this.controller.getById(this.service, this.schema)
    );
    return this;
  }

  addDeleteDefault() {
    this.routes.delete(
      '/:id',
      validate([param('id').isString()]),
      // itemController.deleteItem
      this.controller.deleteById(this.service, this.schema)
    );
    return this;
  }
}

export default BaseRouter;

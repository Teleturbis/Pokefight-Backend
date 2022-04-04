import express from 'express';
import userController from '../controller/user';

// ...rest of the initial code omitted for simplicity.
import { body, param } from 'express-validator';
import validate from './validate';
import checkUserExists from '../middleware/checkUserExists';

const routesUser = express.Router();

routesUser.get('/', userController.getUsers);
routesUser.post(
  '/',
  validate([
    body('username').not().isEmpty().withMessage('User Name is required'),
    body('email').not().isEmpty().withMessage('Email is required'),
    body('password').not().isEmpty().withMessage('Password is required'),
  ]),
  userController.createUser
);

routesUser.post(
  '/login',
  validate([
    body('user').not().isEmpty().withMessage('User Name is required'),
    body('type').not().isEmpty().withMessage('Type is required'),
    body('password').not().isEmpty().withMessage('Password is required'),
  ]),
  userController.loginUser
);

routesUser.get(
  '/:id',
  validate([param('id').isNumeric()]),
  checkUserExists,
  userController.getUser
);

routesUser.put(
  '/:id',
  validate([
    param('id').isNumeric(),
    body('username').not().isEmpty().withMessage('User Name is required'),
    body('email').not().isEmpty().withMessage('Email is required'),
    body('password').not().isEmpty().withMessage('Password is required'),
  ]),
  checkUserExists,
  userController.editUser
);

routesUser.delete(
  '/:id',
  validate([param('id').isNumeric()]),
  checkUserExists,
  userController.deleteUser
);

routesUser.get(
  '/:id/orders',
  validate([param('id').isNumeric()]),
  checkUserExists,
  userController.getUserOrders
);

routesUser.put(
  '/:id/check-inactive',
  validate([param('id').isNumeric()]),
  checkUserExists,
  userController.checkInactive
);

// can be reused by many routes

export { routesUser };

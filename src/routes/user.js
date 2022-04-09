import express from 'express';

// ...rest of the initial code omitted for simplicity.
import { body, param } from 'express-validator';
import validate from '../js/validate';
import checkUserExists from '../middleware/checkUserExists';

import controller from '../controller/user';
import service from '../service/user';
import schema from '../model/user';

const routesUser = express.Router();

routesUser.get('/', controller.getUsers);
routesUser.post(
  '/',
  validate([
    body('username').not().isEmpty().withMessage('User Name is required'),
    body('email').not().isEmpty().withMessage('Email is required'),
    body('password').not().isEmpty().withMessage('Password is required'),
  ]),
  controller.createUser
);

routesUser.post(
  '/login',
  validate([
    body('user').not().isEmpty().withMessage('User Name is required'),
    body('type').not().isEmpty().withMessage('Type is required'),
    body('password').not().isEmpty().withMessage('Password is required'),
  ]),
  controller.loginUser
);

routesUser.get(
  '/:id/logout',
  validate([param('id').isString()]),
  checkUserExists,
  controller.logoutUser
);

routesUser.put(
  '/:id/change-password',
  validate([
    param('id').isString(),
    body('password').not().isEmpty().withMessage('Password is required'),
  ]),
  checkUserExists,
  controller.changePassword
);

routesUser.put(
  '/:id/change-username',
  validate([
    param('id').isString(),
    body('username').not().isEmpty().withMessage('Username is required'),
  ]),
  checkUserExists,
  controller.changeUsername
);

routesUser.get(
  '/:id',
  validate([param('id').isString()]),
  checkUserExists,
  controller.getUser
);

routesUser.get(
  '/check-name/:name',
  validate([param('name').isString()]),
  controller.checkName
);

routesUser.delete(
  '/:id',
  validate([param('id').isString()]),
  checkUserExists,
  controller.deleteUser
);

routesUser.get(
  '/:id/character',
  validate([param('id').isString()]),
  controller.getUserCharacter
);

// routesUser.put(
//   '/:id',
//   validate([
//     param('id').isString(),
//     body('username').not().isEmpty().withMessage('User Name is required'),
//     body('email').not().isEmpty().withMessage('Email is required'),
//     body('password').not().isEmpty().withMessage('Password is required'),
//   ]),
//   checkUserExists,
//   userController.editUser
// );

// routesUser.get(
//   '/:id/orders',
//   validate([param('id').isString()]),
//   checkUserExists,
//   userController.getUserOrders
// );

// routesUser.put(
//   '/:id/check-inactive',
//   validate([param('id').isString()]),
//   checkUserExists,
//   userController.checkInactive
// );

// can be reused by many routes

export { routesUser };

import express from 'express';
import userController from '../controller/user';

// ...rest of the initial code omitted for simplicity.
import { body, param } from 'express-validator';
import validate from '../js/validate';
import checkUserExists, {
  checkUserExistsMongo,
} from '../middleware/checkUserExists';

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
  '/:id/logout',
  validate([param('id').isString()]),
  checkUserExistsMongo,
  userController.logoutUser
);

routesUser.put(
  '/:id/change-password',
  validate([
    param('id').isString(),
    body('password').not().isEmpty().withMessage('Password is required'),
  ]),
  checkUserExistsMongo,
  userController.changePassword
);

routesUser.get(
  '/:id',
  validate([param('id').isString()]),
  checkUserExistsMongo,
  userController.getUser
);

routesUser.delete(
  '/:id',
  validate([param('id').isString()]),
  checkUserExistsMongo,
  userController.deleteUser
);

// routesUser.put(
//   '/:id',
//   validate([
//     param('id').isString(),
//     body('username').not().isEmpty().withMessage('User Name is required'),
//     body('email').not().isEmpty().withMessage('Email is required'),
//     body('password').not().isEmpty().withMessage('Password is required'),
//   ]),
//   checkUserExistsMongo,
//   userController.editUser
// );

// routesUser.get(
//   '/:id/orders',
//   validate([param('id').isString()]),
//   checkUserExistsMongo,
//   userController.getUserOrders
// );

// routesUser.put(
//   '/:id/check-inactive',
//   validate([param('id').isString()]),
//   checkUserExistsMongo,
//   userController.checkInactive
// );

// can be reused by many routes

export { routesUser };

import { BadRequestError, NotFoundError } from '../js/httpError';
import userServiceMongo from '../service/user-mongo';
import BaseController from './controllerBase';

class UserController extends BaseController {
  async createUser(req, res, next) {
    try {
      const id = await userServiceMongo.createUser(req.body);
      if (!id) throw new Error('Error createUser');

      return res.status(200).json({ id: id });
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req, res, next) {
    try {
      return res.status(200).json(await userServiceMongo.loginUser(req.body));
    } catch (error) {
      next(error);
    }
  }

  async logoutUser(req, res, next) {
    try {
      const result = await userServiceMongo.logoutUser(req.user.id);

      if (result) return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const result = await userServiceMongo.changePassword(
        req.user.id,
        req.body
      );

      if (result) return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      return res.status(200).json(await userServiceMongo.getUsers());
    } catch (error) {
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      return res.status(200).json(req.user);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const result = await userServiceMongo.deleteUser(req.user.id);

      if (result) return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ######################## OLD

  async editUser(req, res, next) {
    try {
      const result = await userServiceMongo.editUser(req.user.id, req.body);

      if (result) return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const result = await userServiceMongo.deleteUser(req.user.id);

      if (result) return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req, res, next) {
    try {
      const result = await userServiceMongo.getUserOrders(req.user.id);

      if (result) return res.status(200).json(result);
      else return next(new NotFoundError());
    } catch (error) {
      next(error);
    }
  }

  async checkInactive(req, res, next) {
    try {
      const result = await userServiceMongo.checkInactive(req.user.id);

      if (result) return res.status(200).json(result);
      else return next(new NotFoundError());
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();

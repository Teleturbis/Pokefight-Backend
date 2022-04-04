import { BadRequestError, NotFoundError } from '../js/httpError';
import userService from '../service/user';

class UserController {
  async createUser(req, res, next) {
    try {
      const id = await userService.createUser(req.body);
      if (!id) throw new Error('Error createUser');

      return res.status(200).json({ id: id });
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req, res, next) {
    try {
      return res.status(200).json(await userService.loginUser(req.body));
    } catch (error) {
      next(error);
    }
  }

  async logoutUser(req, res, next) {
    try {
      const result = await userService.logoutUser(req.user.id);

      if (result) return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      return res.status(200).json(await userService.getUsers());
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

  async editUser(req, res, next) {
    try {
      const result = await userService.editUser(req.user.id, req.body);

      if (result) return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const result = await userService.deleteUser(req.user.id);

      if (result) return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req, res, next) {
    try {
      const result = await userService.getUserOrders(req.user.id);

      if (result) return res.status(200).json(result);
      else return next(new NotFoundError());
    } catch (error) {
      next(error);
    }
  }

  async checkInactive(req, res, next) {
    try {
      const result = await userService.checkInactive(req.user.id);

      if (result) return res.status(200).json(result);
      else return next(new NotFoundError());
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();

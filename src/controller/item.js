import { NotFoundError } from '../js/httpError';
import service from '../service/item';
import BaseController from './controllerBase';

class ItemController extends BaseController {
  async createItem(req, res, next) {
    try {
      const id = await service.createItem(req.body);
      if (!id) throw new Error('Error createItem');

      return res.status(200).json({ id: id });
    } catch (error) {
      next(error);
    }
  }
  async getByType(req, res, next) {
    try {
      // const id = await service.createItem(req.body);
      // if (!id) throw new Error('Error createItem');

      return res.status(200).json({ type: req.params.type });
    } catch (error) {
      next(error);
    }
  }
}

export default new ItemController();

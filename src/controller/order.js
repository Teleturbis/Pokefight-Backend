import { NotFoundError } from '../js/HttpError';
import orderService from '../service/order';

class OrderController {
  async createOrder(req, res) {
    try {
      const id = await orderService.createOrder(req.body);
      if (!id) throw new Error('Error createOrder');

      return res.status(200).json({ id: id });
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req, res) {
    try {
      const result = await orderService.getOrders();

      if (result) return res.status(200).json(result);
      else return next(new NotFoundError());
    } catch (error) {
      next(error);
    }
  }

  async getOrder(req, res) {
    try {
      const result = await orderService.getOrder(req.params.id);

      if (result) return res.status(200).json(result);
      else return next(new NotFoundError());
    } catch (error) {
      next(error);
    }
  }

  async editOrder(req, res) {
    try {
      const result = await orderService.editOrder(req.params.id, req.body);

      if (result) return res.status(200).json(result);
      else return next(new NotFoundError());
    } catch (error) {
      next(error);
    }
  }

  async deleteOrder(req, res) {
    try {
      const result = await orderService.deleteOrder(req.params.id);

      if (result) return res.status(200).json(result);
      else return next(new NotFoundError());
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();

import { NotFoundError } from '../js/httpError';
import itemService from '../service/item';

class ItemController {
  // async createItem(req, res, next) {
  //   try {
  //     const id = await itemService.createItem(req.body);
  //     if (!id) throw new Error('Error createItem');
  //     return res.status(200).json({ id: id });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  // async getItems(req, res, next) {
  //   try {
  //     const result = await itemService.getItems();
  //     if (result) return res.status(200).json(result);
  //     else return next(new NotFoundError());
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  // async getItem(req, res, next) {
  //   try {
  //     const result = await itemService.getItem(req.params.id);
  //     if (result) return res.status(200).json(result);
  //     else return next(new NotFoundError());
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  // async deleteItem(req, res, next) {
  //   try {
  //     const result = await itemService.deleteItem(req.params.id);
  //     if (result) return res.status(200).json(result);
  //     else return next(new NotFoundError());
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

export default new ItemController();

import mongoose from 'mongoose';
import ServiceBase from './serviceBase';
import itemSchema from '../model/item';
import { BadRequestError } from '../js/httpError';

// import pokedex from '../model/pokedex.json';

class ItemService extends ServiceBase {
  async createItem(itemDto) {
    await this.checkName(itemDto.name);

    const id = this.create(itemDto, itemSchema);

    return id;
  }

  async checkData(req) {
    return await ItemService.checkName(req.params.id, req.body.name);
  }

  static async checkName(id, name) {
    const result = await itemSchema.find({ name: name, _id: { $ne: id } });
    if (result.length > 0) {
      throw new BadRequestError('Itemname already exists');
    }

    return result;
  }
}

export default new ItemService();

import mongoose from 'mongoose';
import ServiceBase from './serviceBase';
import itemSchema from '../model/item';
import { BadRequestError } from '../js/httpError';

// import pokedex from '../model/pokedex.json';

class ItemService extends ServiceBase {
  async checkData(req) {
    return await this.checkName(req.body.name, req.params.id);
  }

  async checkName(name, id) {
    const result = await itemSchema.find({ name: name, _id: { $ne: id } });
    if (result.length > 0) {
      throw new BadRequestError('Itemname already exists');
    }

    return result;
  }
}

export default new ItemService();

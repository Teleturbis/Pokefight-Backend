import item from '../model/item';
import mongoose from 'mongoose';
import ServiceBase from './serviceBase';

// import pokedex from '../model/pokedex.json';

class ItemService extends ServiceBase {
  async createItem(itemDto) {
    return this.create(itemDto, item);
  }

  async getItems() {
    return this.getAll(item);
  }

  async getItem(id) {
    return this.getById(id, item);
  }

  async deleteItem(id) {
    return this.deleteById(id, item);
  }
}

export default new ItemService();

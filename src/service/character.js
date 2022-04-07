import character from '../model/character';
import mongoose from 'mongoose';
import ServiceBase from './serviceBase';
import { BadRequestError } from '../js/httpError';

// import pokedex from '../model/pokedex.json';

class CharacterService extends ServiceBase {
  async createCharacter(characterDto) {
    const charDB = await this.getCharacterByUser(characterDto.userid);
    if (charDB && charDB.length > 0) {
      throw new BadRequestError('User already has a character');
    }
    return this.create(characterDto, character);
  }

  async getCharacters() {
    return this.getAll(character);
  }

  async getCharacter(id) {
    return this.getById(id, character);
  }

  async getCharacterByUser(userId) {
    const charDB = await character.find({ userid: userId });
    console.log('charDB', charDB);
    return charDB;
  }

  async deleteCharacter(id) {
    return this.deleteById(id, character);
  }
}

export default new CharacterService();

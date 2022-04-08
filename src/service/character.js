import mongoose from 'mongoose';
import ServiceBase from './serviceBase';
import { BadRequestError } from '../js/httpError';
// models
import character from '../model/character';
import pokemon from '../model/pokemon';
import item from '../model/item';

// import pokedex from '../model/pokedex.json';

class CharacterService extends ServiceBase {
  async createCharacter(characterDto) {
    const charDB = await this.getCharacterByUser(characterDto.userid);
    if (charDB && charDB.length > 0) {
      throw new BadRequestError('User already has a character');
    }
    return this.create(characterDto, character);
  }

  async getCharacterByUser(userId) {
    const charDB = await character.find({ userid: userId });
    console.log('charDB', charDB);
    return charDB;
  }

  async addPokemon(id, pokemonId) {
    console.log('pokemonId', pokemonId);
    const charDB = await this.getById(id, character);
    const pokemonDB = await pokemon.findById(pokemonId);

    if (charDB.pokemons.some((p) => p.pokemonid.toString() === pokemonId)) {
      throw new BadRequestError('Pokemon already in inventory');
    }

    charDB.pokemons.push({
      pokemonid: pokemonId,
      name: pokemonDB.name,
      stats: pokemonDB.stats,
    });

    await charDB.save();

    // console.log('charDB', charDB);
    return this.getById(id, character);
  }

  async removePokemon(id, pokemonId) {
    console.log('pokemonId', pokemonId);
    const charDB = await this.getById(id, character);

    charDB.pokemons = charDB.pokemons.filter(
      (p) => p.pokemonid.toString() !== pokemonId
    );

    await charDB.save();

    // console.log('charDB', charDB);
    return this.getById(id, character);
  }

  async healPokemon(id, pokemonId, amount) {
    console.log('pokemonId', pokemonId);
    const charDB = await this.getById(id, character);
    const charPokemon = charDB.pokemons.find(
      (p) => p.pokemonid.toString() === pokemonId
    );

    charPokemon.stats.hp += +amount;

    await charDB.save();

    // console.log('charDB', charDB);
    return this.getById(id, character);
  }

  async addItem(id, itemId, amount = 1) {
    console.log('amount', amount);
    const charDB = await this.getById(id, character);
    const itemDB = await item.findById(itemId);

    const charItem = charDB.items.find((i) => i.itemid.toString() === itemId);

    if (charItem) {
      charItem.count += +amount;
    } else {
      charDB.items.push({
        itemid: itemId,
        name: itemDB.name,
        count: 1,
      });
    }

    await charDB.save();

    // console.log('charDB', charDB);
    return this.getById(id, character);
  }

  async useItem(id, itemId) {
    const charDB = await this.getById(id, character);
    const itemDB = await item.findById(itemId);

    const charItem = charDB.items.find((i) => i.itemid.toString() === itemId);

    if (charItem && charItem.count > 0) {
      charItem.count -= 1;
      await charDB.save();
    }

    // console.log('charDB', charDB);
    return this.getById(id, character);
  }
}

export default new CharacterService();

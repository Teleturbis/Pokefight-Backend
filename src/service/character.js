import mongoose from 'mongoose';
import ServiceBase from './serviceBase';
import { BadRequestError } from '../js/httpError';
// models
import characterSchema from '../model/character';
import pokemon from '../model/pokemon';
import item from '../model/item';

// import pokedex from '../model/pokedex.json';

class CharacterService extends ServiceBase {
  async createCharacter(characterDto) {
    const charDB = await this.getCharacterByUser(characterDto.userid);
    if (charDB && charDB.length > 0) {
      throw new BadRequestError('User already has a character');
    }
    return this.create(characterDto, characterSchema);
  }

  async getCharacterByUser(userId) {
    const charDB = await characterSchema.find({ userid: userId });
    console.log('charDB', charDB);
    return charDB;
  }

  async addPokemon(id, pokemonId) {
    console.log('pokemonId', pokemonId);

    const result = await this.editDocumentById(
      id,
      characterSchema,
      async (docChar) => {
        const docPokemon = await pokemon.findById(pokemonId);

        if (
          docChar.pokemons.some((p) => p.pokemonid.toString() === pokemonId)
        ) {
          throw new BadRequestError('Pokemon already in inventory');
        }

        docChar.pokemons.push({
          pokemonid: pokemonId,
          name: docPokemon.name,
          stats: docPokemon.stats,
        });
      }
    );

    // console.log('charDB', charDB);
    return this.getById(id, characterSchema);
  }

  async removePokemon(id, pokemonId) {
    console.log('pokemonId', pokemonId);

    const result = await this.editDocumentById(
      id,
      characterSchema,
      async (doc) => {
        doc.pokemons = doc.pokemons.filter(
          (p) => p.pokemonid.toString() !== pokemonId
        );
      }
    );

    // console.log('charDB', charDB);
    return this.getById(id, characterSchema);
  }

  async changeHpPokemon(id, pokemonId, amount) {
    console.log('pokemonId', pokemonId);

    const result = await this.editDocumentById(
      id,
      characterSchema,
      async (docChar) => {
        const docPokemon = docChar.pokemons.find(
          (p) => p.pokemonid.toString() === pokemonId
        );

        docPokemon.stats.hp += +amount;
      }
    );

    // console.log('charDB', charDB);
    return this.getById(id, characterSchema);
  }

  async addItem(id, itemId, amount = 1) {
    console.log('amount', amount);

    const result = await this.editDocumentById(
      id,
      characterSchema,
      async (docChar) => {
        const docItem = await item.findById(itemId);

        const charItem = docChar.items.find(
          (i) => i.itemid.toString() === itemId
        );

        if (charItem) {
          charItem.count += +amount;
        } else {
          docChar.items.push({
            itemid: itemId,
            name: docItem.name,
            count: 1,
          });
        }
      }
    );

    // console.log('charDB', charDB);
    return this.getById(id, characterSchema);
  }

  async useItem(id, itemId) {
    const result = await this.editDocumentById(
      id,
      characterSchema,
      async (doc) => {
        const charItem = doc.items.find((i) => i.itemid.toString() === itemId);

        if (charItem && charItem.count > 0) {
          charItem.count -= 1;
        }
      }
    );

    // console.log('charDB', charDB);
    return this.getById(id, characterSchema);
  }
}

export default new CharacterService();

import mongoose from 'mongoose';
import ServiceBase from './serviceBase';
import { BadRequestError } from '../js/httpError';
// models
import characterSchema from '../model/character';
import pokemonSchema from '../model/pokemon';
import itemSchema from '../model/item';
import { charPokemons } from '../model/views';

// import pokedex from '../model/pokedex.json';

class CharacterService extends ServiceBase {
  async createCharacter(req) {
    await this.checkData(req);

    const id = await this.create(req.body, characterSchema);

    // todo add 5 random pokemons
    const pokemons = await pokemonSchema.find({});

    const random = () => Math.floor(Math.random() * 380);

    try {
      // todo async loop
      // [...Array(5).keys()].forEach(() => {
      //   await this.addPokemon(id, random());
      // });
      await this.addPokemon(id, pokemons[random()]);
      await this.addPokemon(id, pokemons[random()]);
      await this.addPokemon(id, pokemons[random()]);
      await this.addPokemon(id, pokemons[random()]);
      await this.addPokemon(id, pokemons[random()]);
    } catch (error) {
      console.log('error', error);
    }

    return id;
  }

  async checkData(req) {
    await this.checkCharacter(req.body.userid);
    await this.checkName(req.body.name, req.params.id);
    // const charDB = await this.getCharacterByUser(characterDto.userid);
    // if (charDB && charDB.length > 0) {
    //   throw new BadRequestError('User already has a character');
    // }
    return true;
  }

  async checkCharacter(userId) {
    const charDB = await this.getCharacterByUser(userId);
    if (charDB && charDB.length > 0) {
      throw new BadRequestError('User already has a character');
    }
    return true;
  }

  async checkName(name, id) {
    const result = await characterSchema.find({ name: name, _id: { $ne: id } });
    if (result.length > 0) {
      throw new BadRequestError('Character Name already exists');
    }
    return result;
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
        const docPokemon = await pokemonSchema.findById(pokemonId);

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

        return docChar;
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
        return doc;
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
        return docChar;
      }
    );

    // console.log('charDB', charDB);
    return this.getById(id, characterSchema);
  }

  async battleResult(id, pokemonId, battleResult) {
    console.log('pokemonId', pokemonId);

    // const result = await this.editDocumentById(
    //   id,
    //   characterSchema,
    //   async (docChar) => {
    //     const docPokemon = docChar.pokemons.find(
    //       (p) => p.pokemonid.toString() === pokemonId
    //     );

    //     docPokemon.stats.hp += +amount;
    //     return docChar;
    //   }
    // );

    // console.log('charDB', charDB);
    return this.getById(id, characterSchema);
  }

  async addItem(id, itemId, amount = 1) {
    console.log('amount', amount);

    const result = await this.editDocumentById(
      id,
      characterSchema,
      async (docChar) => {
        const docItem = await itemSchema.findById(itemId);

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
        return docChar;
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
        return doc;
      }
    );

    // console.log('charDB', charDB);
    return this.getById(id, characterSchema);
  }

  async getPokemons(id) {
    let pokemons = await charPokemons.find({ _id: id });
    pokemons = pokemons.map((p) => p._doc.pokemon[0]);
    return pokemons;
  }
}

export default new CharacterService();

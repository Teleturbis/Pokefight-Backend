import pokemon from '../model/pokemon';
import mongoose from 'mongoose';
import ServiceBase from './serviceBase';

// import pokedex from '../model/pokedex.json';

class PokemonService extends ServiceBase {
  async createPokemon(pokemonDto) {
    pokemonDto._id = new mongoose.Types.ObjectId();

    const doc = await pokemon.create(pokemonDto);
    const _id = doc._id;

    console.log('mongo-id', _id);

    return _id;
  }

  async getPokemons() {
    const pokemonsDB = await pokemon.find({});
    // const pokemonsDB = pokedex;

    return pokemonsDB;
  }

  async getPokemon(id) {
    console.log('id', id);
    const pokemonDB = await pokemon.findById(id);
    // const pokemonDB = pokedex.find((pokemon) => pokemon.id === +id);

    console.log('pokemonDB', pokemonDB);

    return pokemonDB;
  }

  async getPokemonInfo(id, info) {
    const pokemonDB = await pokemon.findById(id);
    // const pokemonDB = pokedex.find((pokemon) => pokemon.id === +id);

    console.log('pokemonDB', pokemonDB);

    return pokemonDB[info];
  }

  async deletePokemon(id) {
    const pokemonDB = await pokemon.deleteOne({ _id: id });

    console.log('pokemonDB', pokemonDB);
    // pokemonDB.pokemons = await pokemon.getPokemonPokemons(pokemonDB.id);

    return pokemonDB;
  }

  // ################################## OLD

  // async getPokemonsByUser(userId) {
  //   const pokemonsDB = await pokemon.getPokemonsByUser(userId);

  //   console.log('pokemonsDB', pokemonsDB.id);
  //   // pokemonDB.pokemons = await pokemon.getPokemonPokemons(pokemonDB.id);

  //   return pokemonsDB;
  // }

  // async editPokemon(id, pokemonDto) {
  //   const { price, date, userId } = pokemonDto;
  //   const pokemonDB = await pokemon.updatePokemon(
  //     id,
  //     price,
  //     date ? date : new Date(),
  //     userId
  //   );

  //   console.log('pokemonDB', pokemonDB);
  //   // pokemonDB.pokemons = await pokemon.getPokemonPokemons(pokemonDB.id);

  //   return pokemonDB;
  // }
}

export default new PokemonService();

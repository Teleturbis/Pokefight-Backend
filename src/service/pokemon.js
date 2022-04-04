import pokemon from '../model/pokemon';
import pokedex from '../model/pokedex.json';

class PokemonService {
  createPokemon(pokemonDto) {
    const { price, date, userId } = pokemonDto;

    return pokemon.createPokemon(price, date ? date : new Date(), userId);
  }

  async getPokemons() {
    const pokemonsDB = await pokemon.find({});
    // const pokemonsDB = pokedex;

    return pokemonsDB;
  }

  async getPokemon(id) {
    const pokemonDB = await pokemon.find({ id: id });
    // const pokemonDB = pokedex.find((pokemon) => pokemon.id === +id);

    console.log('pokemonDB', pokemonDB);

    return pokemonDB;
  }

  async getPokemonInfo(id, info) {
    const pokemonDB = await pokemon.find({ id: id });
    // const pokemonDB = pokedex.find((pokemon) => pokemon.id === +id);

    console.log('pokemonDB', pokemonDB[0]);

    return pokemonDB[0][info];
  }

  // ################################## OLD

  async getPokemonsByUser(userId) {
    const pokemonsDB = await pokemon.getPokemonsByUser(userId);

    console.log('pokemonsDB', pokemonsDB.id);
    // pokemonDB.pokemons = await pokemon.getPokemonPokemons(pokemonDB.id);

    return pokemonsDB;
  }

  async editPokemon(id, pokemonDto) {
    const { price, date, userId } = pokemonDto;
    const pokemonDB = await pokemon.updatePokemon(
      id,
      price,
      date ? date : new Date(),
      userId
    );

    console.log('pokemonDB', pokemonDB);
    // pokemonDB.pokemons = await pokemon.getPokemonPokemons(pokemonDB.id);

    return pokemonDB;
  }

  async deletePokemon(id) {
    const pokemonDB = await pokemon.deletePokemon(id);

    console.log('pokemonDB', pokemonDB);
    // pokemonDB.pokemons = await pokemon.getPokemonPokemons(pokemonDB.id);

    return pokemonDB;
  }
}

export default new PokemonService();

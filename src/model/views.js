import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const charPokemons = mongoose.model('char-pokemons', new Schema({}));

export { charPokemons };

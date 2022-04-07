import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const pokemonSchema = new Schema({
  name: String,
  type: [
    {
      slot: Number,
      type: {
        name: String,
        url: String,
      },
    },
  ],
  defaultPokemon: Boolean,
  location: String,
  description: String,
  stats: {
    hp: Number,
    attack: Number,
    defense: Number,
    specialAttack: Number,
    speed: Number,
  },
  moves: [
    {
      name: String,
      description: String,
      effectsOwner: Boolean,
      type: Object, // todo mag String nicht
      value: Number,
    },
  ],
  gif: {
    back: String,
    front: String,
  },
});

export default mongoose.model('Pokemon', pokemonSchema);

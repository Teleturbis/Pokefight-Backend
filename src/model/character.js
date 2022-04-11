import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const pokemonSchema = new Schema(
  {
    pokemonid: mongoose.Types.ObjectId,
    ep: Number,
    level: Number,
    stats: {
      hp: Number,
      attack: Number,
      defense: Number,
      specialAttack: Number,
      speed: Number,
    },
  },
  { _id: false }
);

const itemSchema = new Schema(
  {
    itemid: mongoose.Types.ObjectId,
    name: String,
    count: Number,
  },
  { _id: false }
);

const characterSchema = new Schema({
  name: String,
  skin: String,
  userid: mongoose.Types.ObjectId,
  gold: Number,
  pokemons: [pokemonSchema],
  items: [itemSchema],
});

export default mongoose.model('Character', characterSchema);

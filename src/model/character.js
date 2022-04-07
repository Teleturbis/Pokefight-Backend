import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const characterSchema = new Schema({
  name: String,
  skin: String,
  userid: String,
  pokemons: [
    {
      pokemonId: Number,
      type: {
        name: String,
        stats: {
          hp: Number,
          attack: Number,
          defense: Number,
          specialAttack: Number,
          speed: Number,
        },
      },
    },
  ],
  items: [
    {
      itemid: String,
      name: String,
      count: Number,
    },
  ],
});

export default mongoose.model('Character', characterSchema);

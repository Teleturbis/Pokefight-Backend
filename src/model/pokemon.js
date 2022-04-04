import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const pokemonSchema = new Schema({
  id: Number,
  name: {
    english: String,
    japanese: String,
    chinese: String,
    french: String,
  },
  type: [String],
  base: {
    HP: Number,
    Attack: Number,
    Defense: Number,
    Sp: {
      Attack: Number,
      Defense: Number,
    },
    Speed: Number,
  },
});

export default mongoose.model('Pokemon', pokemonSchema);

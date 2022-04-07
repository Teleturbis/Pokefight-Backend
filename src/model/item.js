import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  type: String,
  description: String,
  rarity: String,
  icon: String,
  effects: [
    {
      target: String,
      value: Number,
      type: Object,
    },
  ],
});

export default mongoose.model('Item', userSchema);

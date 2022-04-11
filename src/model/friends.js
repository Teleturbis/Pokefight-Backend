import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const friendSchema = new Schema({
  left: mongoose.Types.ObjectId,
  right: mongoose.Types.ObjectId,
  type: String,
  date: Date,
});

export default mongoose.model('friend', friendSchema);

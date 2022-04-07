import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  validated: Boolean,
  online: Boolean,
  token: String,
  avatar: String,
  lastPosition: {
    x: Number,
    y: Number,
  },
  character: {
    avatar: String,
  },
});

export default mongoose.model('User', userSchema);

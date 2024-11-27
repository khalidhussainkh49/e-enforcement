import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'away'],
    default: 'offline'
  },
  lastActive: { type: Date, default: Date.now },
  peerId: { type: String },
});

export default mongoose.model('User', userSchema);
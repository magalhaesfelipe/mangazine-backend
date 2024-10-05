import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'user' },
    readList: { type: mongoose.Schema.Types.ObjectId, ref: 'Readlist' },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;

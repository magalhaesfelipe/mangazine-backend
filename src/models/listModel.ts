import mongoose from 'mongoose';

const listSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    titles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Title' }], // Array of strings representing titles
    userId: { type: String, required: true }, // Store Clerk user ID
  },
  { timestamps: true },
);

const List = mongoose.model('List', listSchema);

export default List;

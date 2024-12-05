import mongoose, { Schema, Document } from 'mongoose';

interface IItem {
  itemId: mongoose.Types.ObjectId | null; // Allow null
  itemModel: 'Manga' | 'Book';
}

interface IReadlist extends Document {
  userId: string;
  items: IItem[];
}

const readlistSchema = new Schema<IReadlist>(
  {
    userId: { type: String, required: true, unique: true },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'items.itemModel',
          required: true,
          default: null,
        },
        itemModel: { type: String, required: true, enum: ['Manga', 'Book'] },
      },
    ],
  },
  { timestamps: true },
);

const Readlist = mongoose.model('Readlist', readlistSchema);

export default Readlist;

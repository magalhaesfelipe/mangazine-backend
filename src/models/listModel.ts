import mongoose from 'mongoose';

interface IItem {
  itemId: mongoose.Types.ObjectId | null;
  itemModel: 'Manga' | 'Book';
}

interface IReadlist extends Document {
  name: string;
  userId: string;
  items: IItem[];
}

const listSchema = new mongoose.Schema<IReadlist>(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
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

export const List = mongoose.model('List', listSchema);

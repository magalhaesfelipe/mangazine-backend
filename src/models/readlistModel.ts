import mongoose from 'mongoose';

const readlistSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: 'items.itemModel',
        },
        itemModel: { type: String, required: true, enum: ['Manga', 'Book'] },
      },
    ],
  },
  { timestamps: true },
);

const Readlist = mongoose.model('Readlist', readlistSchema);

export default Readlist;

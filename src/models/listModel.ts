import mongoose from 'mongoose';

const listSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, refPath: 'itemsModel' }],
    itemsModel: [
      {
        type: String,
        required: true,
        enum: ['Manga', 'Book'],
      },
    ],
  },
  { timestamps: true },
);

export const List = mongoose.model('List', listSchema);

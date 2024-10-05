import mongoose from 'mongoose';

const readlistSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'itemsModel',
      },
    ],
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

const Readlist = mongoose.model('Readlist', readlistSchema);

export default Readlist;

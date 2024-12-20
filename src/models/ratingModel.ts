import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    itemId: {
      type: mongoose.Schema.ObjectId,
      refPath: 'itemModel',
      required: true,
    },
    itemModel: {
      type: String,
      required: true,
      enum: ['Manga', 'Book'],
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  { timestamps: true }, // This adds 'createdAt' and 'updatedAt' fields
);

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;

import mongoose, { Schema } from 'mongoose';

// test
const authorSchema = new Schema({ 
  name: {
    type: String,
    required: [true, 'An Author must have a name'],
    unique: true,
    trim: true,
    validate: {
      validator: (value: string) => {
        return !!(value && value.trim().length > 0);
      },
      message: `The author's name cannot be empty`,
    },
  },
  bio: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  placeOfBirth: {
    type: String,
    trim: true,
  },
  photo: {
    type: String,
  },
  works: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'worksModel',
    },
  ],
  worksModel: [
    {
      type: String,
      required: true,
      enum: ['Manga', 'Book'],
    },
  ],
  otherPhotos: [{ type: String }],
});

const Author = mongoose.model('Author', authorSchema);

export default Author;

import mongoose, { Schema } from 'mongoose';

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
  Nationality: {
    type: String,
    trim: true,
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
  photo: {
    type: String,
  },
  otherPhotos: [{ type: String }],
});

const Author = mongoose.model('Author', authorSchema);

export default Author;

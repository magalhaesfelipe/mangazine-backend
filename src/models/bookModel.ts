import mongoose, { Schema } from 'mongoose';

const bookSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A book must have a name'],
    unique: true,
    trim: true,
    validate: {
      validator: (value: string) => {
        return !!(value && value.trim().length > 0);
      },
      message: `The book's name cannot be empty`,
    },
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  releaseYear: { type: String },
  description: { type: String },
  cover: { type: String },
  pages: { type: Number },
  genre: [{ type: String }],
  otherCovers: [{ type: String }],
  type: { type: String, default: 'book' },
  alternativeName: { type: String },
});

const Book = mongoose.model('Book', bookSchema);

export default Book;

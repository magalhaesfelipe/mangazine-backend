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
  authorName: { type: String },
  releaseYear: { type: String },
  description: { type: String },
  genre: [{ type: String }],
  pages: { type: Number },
  publishedBy: { type: String },
  type: { type: String, default: 'Book' },
  cover: { type: String },
  otherCovers: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
});

const Book = mongoose.model('Book', bookSchema);

export default Book;

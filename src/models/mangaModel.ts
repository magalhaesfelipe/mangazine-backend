import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Manga document
interface IManga extends Document {
  name: string;
  authorName: string;
  author?: string;
  releaseYear?: string;
  description?: string;
  chapters?: string;
  publishedBy?: string;
  genre?: string[];
  cover?: string;
  otherCovers?: string[];
  status?: string;
  type?: string;
  demographic?: string;
  alternativeName?: string;
}

const mangaSchema = new Schema<IManga>({
  name: {
    type: String,
    required: [true, 'A Manga must have a name'],
    unique: true,
    trim: true, // Removes whitespace from the beginning and end of the string
    validate: {
      validator: (value: string) => {
        // Ensure the value is not an empty string
        return !!(value && value.trim().length > 0);
      },
      message: 'A Manga name cannot be empty',
    },
  },
  authorName: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  releaseYear: { type: String },
  description: { type: String },
  chapters: { type: String },
  publishedBy: { type: String },
  genre: [{ type: String }],
  cover: { type: String },
  otherCovers: [{ type: String }],
  status: { type: String },
  type: { type: String, default: 'manga' },
  demographic: { type: String },
  alternativeName: { type: String },
});

// Create the model with the Manga interface
const Manga = mongoose.model<IManga>('Manga', mangaSchema);

export default Manga;

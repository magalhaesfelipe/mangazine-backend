import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Title document
interface ITitle extends Document {
  name: string;
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
  alternateName?: string;
}

const titleSchema = new Schema<ITitle>({
  name: {
    type: String,
    required: [true, 'A title must have a name'],
    unique: true,
    trim: true, // Removes whitespace from the beginning and end of the string
    validate: {
      validator: (value: string) => {
        // Ensure the value is not an empty string
        return !!(value && value.trim().length > 0);
      },
      message: 'A title name cannot be empty',
    },
  },
  author: { type: String },
  releaseYear: { type: String },
  description: { type: String },
  chapters: { type: String },
  publishedBy: { type: String },
  genre: [{ type: String }],
  cover: { type: String },
  otherCovers: [{ type: String }],
  status: { type: String },
  type: { type: String },
  demographic: { type: String },
  alternateName: { type: String },
});

// Create the model with the Title interface
const Title = mongoose.model<ITitle>('Title', titleSchema);

export default Title;

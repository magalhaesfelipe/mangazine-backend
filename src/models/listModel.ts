import mongoose from 'mongoose';

const listSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    titles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Title' }], // Array of strings representing titles
    userId: { type: String, required: true }, // Store Clerk user ID
  },
  { timestamps: true },
);

const List = mongoose.model('List', listSchema);

export default List;

/*

In this example:

const List = require('./models/list');

List.findOne({ name: 'My List' })
  .populate('titles') // Populate the 'titles' field with actual title documents
  .exec((err, list) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(list);
  });

findOne is used to find a single list document based on some query criteria.
populate('titles') tells Mongoose to replace the ObjectIds in the titles field with actual title documents.
This makes it convenient to work with related documents in Mongoose, as you can retrieve the related documents in a single query rather than manually fetching them separately.

*/

import express from 'express';
import {
  createAuthor,
  deleteAuthor,
  getAuthorById,
  getAuthorByName,
  updateAuthor,
} from '../controllers/authorController.js';

const router = express.Router();

router.route('/search').get(getAuthorByName); // Get author by name
router
  .route('/:authorId')
  .get(getAuthorById) // Get author by id
  .patch(updateAuthor) // Update author
  .delete(deleteAuthor); // Delete author
router.route('/').post(createAuthor); // Create author

export default router;

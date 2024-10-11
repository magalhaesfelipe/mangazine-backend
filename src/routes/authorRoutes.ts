import express from 'express';
import {
  createAuthor,
  deleteAuthor,
  getAuthorById,
  updateAuthor,
} from '../controllers/authorController.js';

const router = express.Router();

router
  .route('/:authorId')
  .get(getAuthorById) // Get author
  .patch(updateAuthor) // Update author
  .delete(deleteAuthor); // Delete author
router.route('/').post(createAuthor); // Create author

export default router;

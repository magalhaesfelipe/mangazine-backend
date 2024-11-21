import express from 'express';
import {
  getBookById,
  getBookByName,
  updateBook,
  createBook,
  deleteBook,
  getBookByAuthor,
} from '../controllers/bookController.js';

const router = express.Router();

// router.route('/').get(getAllBooks);
router.route('/').post(createBook);
router.route('/search/by-name').get(getBookByName);
router.route('/search/by-author').get(getBookByAuthor);
router.route('/:bookId').get(getBookById).patch(updateBook).delete(deleteBook);

export default router;

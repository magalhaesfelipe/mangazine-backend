import express from 'express';
import {
  getBookById,
  getBookByName,
  updateBook,
  createBook,
  deleteBook,
} from '../controllers/bookController.js';

const router = express.Router();

//hhhhhhhhhhh
// router.route('/').get(getAllBooks);
router.route('/').post(createBook);
router.route('/search').get(getBookByName);
router.route('/:bookId').get(getBookById).patch(updateBook).delete(deleteBook);

export default router;

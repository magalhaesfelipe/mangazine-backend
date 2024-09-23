import express from 'express';
import {
  getAllBooks,
  getBookById,
  getBookByName,
  updateBook,
  createBook,
  deleteBook,
} from '../controllers/bookController.js';

const router = express.Router();

router.route('/get-all-books').get(getAllBooks);
router.route('/:bookId').get(getBookById);
router.route('/search/:bookName').get(getBookByName);
router.route('/update-book/:bookId').patch(updateBook);
router.route('/create-book').post(createBook);
router.route('/delete-book').delete(deleteBook);

export default router;

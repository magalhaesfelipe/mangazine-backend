import { Request, Response, NextFunction } from 'express';
import Book from '../models/bookModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { Types } from 'mongoose';

// GET BOOK BY ID
export const getBookById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return next(new AppError('No book found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      book,
    });
  },
);

// GET BOOK BY NAME
export const getBookByName = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookName } = req.params;
    if (typeof bookName === 'string') {
      const books = await Book.find({ name: new RegExp(bookName, 'i') });

      if (books.length === 0) {
        return next(new AppError('No book found with that name', 404));
      }

      res.status(200).json({
        status: 'success',
        message: `${books.length} books found.`,
        books,
      });
    }
  },
);

// CREATE BOOK
export const createBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newBook = await Book.create(req.body);

    res.status(201).json({
      status: 'success',
      newBook,
    });
  },
);

// UPDATE BOOK
export const updateBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookId } = req.params;
    const updates = req.body;

    const book = await Book.findOneAndUpdate({ _id: bookId }, updates, {
      new: true, // Return the updated document
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      message: 'Book updated succesfully',
      data: {
        book,
      },
    });
  },
);

// DELETE BOOK
export const deleteBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookId } = req.params;

    if (!Types.ObjectId.isValid(bookId)) {
      return next(new AppError('Invalid ID format', 400));
    }

    const book = await Book.findOneAndDelete({ _id: bookId });

    if (!book) {
      return next(new AppError('No Book found with that id to delete', 404));
    }

    res.status(204).send();
  },
);

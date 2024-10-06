import { Request, Response, NextFunction } from 'express';
import Author from '../models/authorModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { Types } from 'mongoose';

// GET AUTHOR BY ID
export const getAuthorById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const author = await Author.findById(req.params.authorId);

    res.status(200).json({
      status: 'success',
      author,
    });
  },
);

// CREATE AUTHOR
export const createAuthor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newAuthor = await Author.create(req.body);

    res.status(201).json({
      status: 'success',
      newAuthor,
    });
  },
);

// UPDATE AUTHOR
export const updateAuthor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorId } = req.params;
    const updates = req.body;

    const updatedAuthor = await Author.findOneAndUpdate(
      { _id: authorId },
      updates,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      status: 'success',
      message: 'Author updated successfully',
      updatedAuthor,
    });
  },
);

// DELETE AUTHOR
export const deleteAuthor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await Author.findByIdAndDelete(req.params.authorId);

    res.status(204).send();
  },
);

import { Request, Response, NextFunction } from 'express';
import Rating from '../models/ratingModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import mongoose from 'mongoose';

// GET RATING
export const getRating = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, itemId } = req.params;

    const userRating = await Rating.findOne({
      userId,
      itemId,
    });

    if (!userRating) {
      res.status(404).json({
        status: 'success',
        message: 'No rating found for this user',
      });
    }

    res.status(200).json({
      status: 'success',
      userRating,
    });
  },
);

// GET AVERAGE RATING
export const getAverageRating = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { itemId } = req.params;

    const objectIdItemId = new mongoose.Types.ObjectId(itemId);

    const avgRating = await Rating.aggregate([
      { $match: { itemId: objectIdItemId } },
      { $group: { _id: '$itemId', averageRating: { $avg: '$rating' } } },
    ]);

    res.status(200).json({
      status: 'success',
      averageRating: avgRating.length > 0 ? avgRating[0] : 0,
    });
  },
);

// CREATE OR UPDATE RATING
export const createRating = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, itemId, ratingValue } = req.body;

    // Try to find the existing rating first
    const existingRating = await Rating.findOne({ userId, itemId });

    // Find and update the existing rating, or create a new one if not found
    const rating = await Rating.findOneAndUpdate(
      { userId: userId, itemId: itemId }, // First object with the fields to identify the document
      { rating: ratingValue }, // Second object with the field to be updated and its new value
      { new: true, runValidators: true, upsert: true }, // 'upsert: true' option allows the operation to insert a new document if no matching document is found
    );

    // Determine whether the document was created or updated
    const wasCreated = !existingRating;

    res.status(wasCreated ? 201 : 200).json({
      status: 'success',
      message: wasCreated
        ? 'Rating created successfully'
        : 'Rating updated successfully',
      ratingObject: rating,
    });
  },
);

// DELETE RATING
export const deleteRating = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, itemId } = req.params;

    const rating = await Rating.findOneAndDelete({ userId, itemId });

    if (!rating) {
      return res.status(404).json({
        status: 'fail',
        message: 'No rating found with that userId or itemId',
      });
    }

    res.status(204).send();
  },
);

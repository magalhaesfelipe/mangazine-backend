import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync.js';
import Readlist from '../models/readlistModel.js';
import AppError from '../utils/appError.js';
import { Types } from 'mongoose';
import Manga from '../models/mangaModel.js';
import Book from '../models/bookModel.js';

// GET READLIST
export const getReadlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const readlist = await Readlist.findOne({ userId });

    if (!readlist) {
      return res.status(404).json({
        status: 'error',
        message: 'Readlist not found!',
      });
    }

    for (let item of readlist.items) {
      if (item.itemModel === 'Manga') {
        item.itemId = await Manga.findById(item.itemId);
      } else if (item.itemModel === 'Book') {
        item.itemId = await Book.findById(item.itemId);
      }
    }

    console.log('Fetched Readlist: ', readlist);

    res.status(200).json({
      status: 'success',
      data: readlist,
    });
  },
);

// CHECK IF ITEM EXISTS IN THE READLIST
export const checkItemExistsInReadlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, itemId } = req.params;

    let itemObjectId: Types.ObjectId;

    try {
      itemObjectId = new Types.ObjectId(itemId);
    } catch (error) {
      return next(new AppError('Invalid item ID format', 400));
    }

    const item = await Readlist.findOne({
      userId,
      'items.itemId': itemObjectId,
    });

    let exists;

    if (item) {
      exists = true;
    } else {
      exists = false;
    }

    res.status(200).json({ exists: exists });
  },
);

// CREATE READLIST
export const createReadlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const readlist = await Readlist.create({
      userId: userId,
      items: [],
    });

    res.status(201).json({
      status: 'success',
      message: 'Readlist created successfully',
      data: readlist,
    });
  },
);

// ADD ITEM TO THE READLIST
export const addToReadlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'No items provided or items is not an array!',
      });
    }

    const updatedReadlist = await Readlist.findOneAndUpdate(
      { userId },
      {
        $push: {
          items: { $each: items }, // This will add multiple items to the array
        },
      },
      { new: true }, // This will return the updated document
    );

    if (!updatedReadlist) {
      return res.status(404).json({
        status: 'fail',
        message: 'Readlist not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Items added!',
      data: updatedReadlist,
    });
  },
);

// DELETE ITEM FROM THE READLIST
export const removeItemFromReadlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, itemId } = req.params;

    const result = await Readlist.updateOne(
      { userId },
      { $pull: { items: { itemId: itemId } } },
    );

    if (result.matchedCount === 0) {
      return next(new AppError('Item to delete not found', 404));
    }

    res.status(204).send();
  },
);

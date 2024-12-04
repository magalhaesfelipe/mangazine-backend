import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync.js';
import Readlist from '../models/readlistModel.js';
import AppError from '../utils/appError.js';
import { Types } from 'mongoose';

// GET READLIST
export const getReadlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const readlist = await Readlist.findOne({ userId }).populate({
      path: 'items.itemId',
      populate: { path: 'itemId' },
    });

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

    const readlist = await Readlist.findOne({ userId });

    if (!readlist) return next(new AppError('Readlist not found', 404));

    if (readlist.items.includes(itemObjectId)) {
      return res.status(200).json({ exists: true });
    }

    return res.status(200).json({ exists: false });
  },
);

// CREATE READLIST
export const createReadlist = async (userId: string) => {
  const readlist = await Readlist.create({
    userId: userId,
    items: [],
  });

  return readlist;
};

// ADD ITEM TO THE READLIST
export const addToReadlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, itemId, itemModel: } = req.params;

    const readlist = await Readlist.findOneAndUpdate(
      { userId },
      {
        $push: {
          items: {itemId, itemModel }
        }
      }
    );

    if (!readlist) return next(new AppError('Readlist not found', 404));

    readlist.items.push(itemId as any);
    await readlist.save();

    res.status(200).json({
      status: 'success',
      message: 'Item added!',
      readlist,
    });
  },
);

// REMOVE ITEM FROM THE READLIST
export const removeItemFromReadlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, itemId } = req.params;

    const result = await Readlist.updateOne(
      { userId },
      { $pull: { items: itemId } },
    );

    if (result.matchedCount === 0) {
      return next(new AppError('Item not found', 404));
    }

    res.status(204).send();
  },
);

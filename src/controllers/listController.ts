import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel.js';
import { List } from '../models/listModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { Types } from 'mongoose';
import Manga from '../models/mangaModel.js';
import Book from '../models/bookModel.js';

// GET ALL LISTS
export const getAllLists = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const lists = await List.find({ userId: userId });

    if (!lists) return next(new AppError('No lists found', 404));

    res.status(200).json({
      status: 'success',
      data: lists,
    });
  },
);

// GET LIST BY ID
export const getListById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { listId } = req.params;

    const list = await List.findById(listId);

    if (!list) {
      return next(new AppError('List not found', 404));
    }

    for (let item of list.items) {
      if (item.itemModel === 'Manga') {
        item.itemId = await Manga.findById(item.itemId);
      } else if (item.itemModel === 'Book') {
        item.itemId = await Book.findById(item.itemId);
      }
    }

    res.status(200).json({
      status: 'sucess',
      data: list,
    });
  },
);

// CHECK IF ITEM EXISTS IN THE LIST
export const checkItemExists = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { listId, itemId } = req.params;

    // Validate listId and titleId
    if (!Types.ObjectId.isValid(listId) || !Types.ObjectId.isValid(itemId)) {
      return next(new AppError('Invalid list or title ID format', 400));
    }

    // Using projection to check for the title's existence
    // and only passing the '_id' to the 'list' variable, instead of the full list document, with other fields like 'name'
    const list = await List.findOne(
      { _id: listId, items: { $elemMatch: { itemId } } }, // Filter the List collection for a document with the  fields '_id' and 'titles' equal to the listId and titleId received in the params
      { _id: 1 }, // Only fetch(projects/returns) the _id field, so we don't need to return the full document(heavier)
    );

    let exists;

    if (list) {
      exists = true;
    } else {
      exists = false;
    }

    return res.status(200).json({ exists: exists });
  },
);

// CREATE LIST
export const createList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, items, userId } = req.body;

    // Create the list
    const newList = await List.create({
      userId,
      name,
      items,
    });

    res.status(201).json({
      status: 'success',
      data: newList,
    });
  },
);

// DELETE LIST
export const deleteList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { listId } = req.params;

    await List.deleteOne({ _id: listId });
    return res.status(204).send();
  },
);

// ADD ITEM TO LIST
export const addToList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { listId } = req.params;
    const { itemId, itemModel } = req.body;

    const list = await List.findById({ _id: listId });
    if (!list) return next(new AppError('List not found', 404));

    list.items.push({ itemId, itemModel });
    await list.save().catch((error) => {
      console.log('Error saving list: ', error.message);
      return next(new AppError('FAILED TO UPDATE LIST', 500));
    });

    return res.status(200).json({
      status: 'success',
      message: 'Item added to list',
      data: list,
    });
  },
);

// REMOVE ITEM FROM LIST
export const removeFromList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { itemId, listId } = req.params;

    const list = await List.findOne({ _id: listId });

    if (!list) return next(new AppError('List not found', 404));

    await List.updateOne({ _id: listId }, { $pull: { items: itemId } });

    return res.status(200).json({
      status: 'success',
      message: 'Item removed from list',
      data: list,
    });
  },
);

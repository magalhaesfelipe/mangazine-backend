import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel.js';
import { List }  from '../models/listModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { Types } from 'mongoose';

// CHECK IF ITEM EXISTS IN READLIST
export const checkItemExists = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, itemId } = req.params;

    // Validate and convert itemId to ObjectId
    let itemObjectId: Types.ObjectId;
    try {
      itemObjectId = new Types.ObjectId(itemId);
    } catch (error) {
      return next(new AppError('Invalid item ID format', 400));
    }

    // Find the user by userId and populate the readList
    const user = await User.findOne({ userId }).populate('readList').lean();

    if (!user || !user.readList) {
      return next(new AppError('User or Readlist not found', 404));
    }

    const readList = user.readList;

    // Check if the item exists in the user's readList
    const itemExists = readList.items && readList.items.some((item: Types.ObjectId) =>
      item.equals(itemObjectId),  
    );

    return res.status(200).json({ exists: itemExists });
  },
);

// GET ALL LISTS
export const getAllLists = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const lists = await List.find({ userId: userId });

    if (!lists) return next(new AppError('No lists found', 404));

    res.status(200).json({
      status: 'success',
      lists,
    });
  },
);

// GET LIST BY ID
export const getListById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { listId } = req.params;

    const list = await List.findById(listId).populate('titles');
    if (!list) {
      return next(new AppError('List not found', 404));
    }

    res.status(200).json({
      status: 'sucess',
      list,
    });
  },
);

// CHECK IF TITLE EXISTS IN THE LIST
export const checkTitleExists = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { listId, titleId } = req.params;

    // Validate listId and titleId
    if (!Types.ObjectId.isValid(listId) || !Types.ObjectId.isValid(titleId)) {
      return next(new AppError('Invalid list or title ID format', 400));
    }

    // Using projection to check for the title's existence
    // and only passing the '_id' to the 'list' variable, instead of the full list document, with other fields like 'name'
    const list = await List.findOne(
      { _id: listId, titles: titleId }, // Filter the List collection for a document with the  fields '_id' and 'titles' equal to the listId and titleId received in the params
      { _id: 1 }, // Only fetch(projects/returns) the _id field, so we don't need to return the full document(heavier)
    );

    if (list) {
      return res.status(200).json({ exists: true });
    }

    return res.status(200).json({ exists: false });
  },
);

// CREATE LIST
export const createList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, titles, userId } = req.body;

    // Create the list
    const newList = await List.create({
      name,
      titles,
      userId,
    });

    // Update the user's lists
    await User.findOneAndUpdate(
      { userId },
      { $push: { lists: newList._id } },
      { new: true, useFindAndModify: false },
    );

    res.status(201).json({
      status: 'success',
      data: {
        list: newList,
      },
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
    const { titleId, listId } = req.params;
    const list = await List.findOne({ _id: listId });

    if (!list) return next(new AppError('List not found', 404));

    await List.updateOne({ _id: listId }, { $push: { titles: titleId } });

    return res.status(200).json({
      status: 'success',
      message: 'Item added to list',
      list: list,
    });
  },
);

// REMOVE ITEM FROM LIST
export const removeFromList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { titleId, listId } = req.params;

    const list = await List.findOne({ _id: listId });

    if (!list) return next(new AppError('List not found', 404));

    await List.updateOne({ _id: listId }, { $pull: { titles: titleId } });

    return res.status(200).json({
      status: 'success',
      message: 'Item removed from list',
      list: list,
    });
  },
);

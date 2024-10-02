import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { Types } from 'mongoose';
import { List } from '../models/listModel.js';
import { createReadlist } from './readlistController.js';

// CHECK IF USER EXISTS
export const checkUserExists = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ userId: req.params.userId });

    if (user) {
      return res.status(200).json({ exists: true });
    }
    return res.status(200).json({ exists: false });
  },
);

// GET USER ROLE
export const getUserRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ userId: req.params.userId });

    if (!user) {
      return next(new AppError('User not found', 404));
    }
    return res.status(200).json({
      status: 'success',
      userRole: user.role,
    });
  },
);

// CREATE USER
export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, userId } = req.body;

    // Create the default readlist for the user
    const readlist = await createReadlist(userId);

    // Create the new user with the default readlist
    const newUser = await User.create({
      name,
      email,
      userId,
    });

    res.status(201).json({
      status: 'success',
      data: {
        userName: newUser.name,
        email: newUser.email,
      },
    });
  },
);

// GET LISTS
export const getLists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Retrieve the userId from the request
  const { userId } = req.params;

  // Find the user by userId and populate the lists field
  const user = await User.findOne({ userId }).populate('lists');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Extract the lists from the user object
  const { lists } = user;

  // Return the lists
  return res.status(200).json({
    status: 'success',
    result: lists.length,
    data: { lists },
  });
};

import { Request, Response, NextFunction } from 'express';
import Author from '../models/authorModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { Types } from 'mongoose';

// GET AUTHOR BY ID
export const getAuthorById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    

    res.status(200).send();
  }
)












import { Request, Response, NextFunction } from 'express';
import Manga from '../models/mangaModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { Types } from 'mongoose';

export const getAllMangas = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // BUILD THE QUERY

    // 1A) FILTERING
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 1B) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Manga.find(JSON.parse(queryStr)); // temporary final query

    // 2) SORTING
    if (typeof req.query.sort === 'string') {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort('name');
    }

    // 3) FIELD LIMITING
    if (typeof req.query.fields === 'string') {
      const fields = req.query.fields.split(',').join(' ');
      console.log(fields);
      query = query.select(fields);
    } else {
      query = query.select('-description');
    }

    // EXECUTE THE QUERY
    const mangas = await query;

    res.status(200).json({
      status: 'success',
      result: mangas.length,
      mangas,
    });
  },
);

// GET MANGA BY ID
export const getMangaById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const manga = await Manga.findById(req.params.mangaId);

    if (!manga) {
      return next(new AppError('No manga found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      manga,
    });
  },
);

// GET MANGA BY NAME
export const getMangaByName = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { mangaName } = req.params; // Get the query parameter from the URL
    if (typeof mangaName === 'string') {
      const mangas = await Manga.find({ name: new RegExp(mangaName, 'i') }); // Perform case-insensitive search

      if (mangas.length === 0) {
        return next(new AppError('No mangas found with that name', 404));
      }

      res.status(200).json({
        status: 'success',
        message: `${mangas.length} items found.`,
        mangas,
      });
    }
  },
);

// CREATE MANGA      This entire async fn is passed as parameter to catchAsync
export const createManga = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newManga = await Manga.create(req.body);

    res.status(201).json({
      status: 'success',
      newManga,
    });
  },
);

// UPDATE MANGA
export const updateManga = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { mangaId } = req.params;

    const updates = req.body;

    const manga = await Manga.findOneAndUpdate({ _id: mangaId }, updates, {
      new: true, // Return the updated document
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      message: 'Manga updated succesfully',
      manga,
    });
  },
);

// DELETE MANGA
export const deleteManga = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate the ID
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid ID format', 400));
    }

    const manga = await Manga.findOneAndDelete({ _id: id });

    if (!manga) {
      return next(new AppError('No manga found with that id to delete', 404));
    }

    res.status(204).send();
  },
);

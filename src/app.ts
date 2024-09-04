import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan'; // Middleware for logging HTTP requests
import cors from 'cors'; // Middleware to handle cross-origin HTTP requests

import AppError from './utils/appError.js';
import { globalErrorHandler } from './controllers/errorController.js';

import titleRouter from './routes/titleRoutes.js';
import userRouter from './routes/userRoutes.js';
import ratingRouter from './routes/ratingRoutes.js';
import listRouter from './routes/listRoutes.js';

const app = express();
mongoose.set('strictQuery', false);

// MIDDLEWARES

// Middleware to enable CORS
app.use(cors());

/* app.use(cors({
  origin: 'https://thefrontendapp.com', // Allow requests only from this domain
  methods: ['GET', 'POST'], // Allow specific HTTP methods
})) */

app.use(morgan('dev')); // 'dev' defines the log format, there are other formats like 'tiny' or 'combined'
app.use(express.json());

// ROUTES
app.use('/test', (req, res) => res.send('Express on Vercel'));
app.use('/titles', titleRouter);
app.use('/user', userRouter);
app.use('/rating', ratingRouter);
app.use('/lists', listRouter);
app.use('/readlist', listRouter);

// needs to be the last part after all the other routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;

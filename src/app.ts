import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan'; // Middleware for logging HTTP requests
import cors from 'cors'; // Middleware to handle cross-origin HTTP requests
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import AppError from './utils/appError.js';
import { globalErrorHandler } from './controllers/errorController.js';

import titleRouter from './routes/titleRoutes.js';
import userRouter from './routes/userRoutes.js';
import ratingRouter from './routes/ratingRoutes.js';
import listRouter from './routes/listRoutes.js';

const app = express();
mongoose.set('strictQuery', false);

// MIDDLEWARES

// SPECIFY WHICH ORIGIN IS ALLOWED TO MAKE REQUESTS(cross-origin) AND WITH WHICH HTTP METHODS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  }),
);

// DEVELOPMENT LOGGING
app.use(morgan('dev')); // 'dev' defines the log format

// LIMIT REQUESTS A CLIENT CAN MAKE (based on their IP)
const limiter = rateLimit({
  max: 100, // max 100 requests
  windowMs: 60 * 60 * 1000, // time window of 1 hour
  message: 'Too many requests from this IP, please try again in 1 hour.',
});
app.use('/', limiter);

// BODY PARSER, reading data from body into 'req.body'
app.use(express.json({ limit: '10kb' }));

// DATA SANITIZATION AGAINST NOSQL QUERY INJECTIONS
app.use(mongoSanitize());

// ROUTES
app.use('/api/test', (req, res) => res.send('Express on Vercel'));
app.use('/api/titles', titleRouter);
app.use('/api/user', userRouter);
app.use('/api/rating', ratingRouter);
app.use('/api/lists', listRouter);
app.use('/api/readlist', listRouter);

// CATCH ALL UNDEFINED ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
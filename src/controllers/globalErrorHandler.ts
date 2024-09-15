import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError.js';

// HANDLE DB CAST ERROR
const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// HANDLE DB DUPLICATED FIELDS
const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;

  return new AppError(message, 400);
};

// HANDLE DB VALIDATION ERROR
const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  
  const message = `Invalid input data. ${errors.join('. ')}`;
  
  return new AppError(message, 400);
};

// DEVELOPMENT
const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// PRODUCTION
const sendErrorProd = (err: any, res: Response) => {
  // Operational error, trusted error that we created: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming  or other unknown error(generic message)
  } else {
    console.error('ERROR 💥', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

// By specifying 4 parameters Express automatically knows that the function is an error handling middleware
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500; // If statusCode is not defined the default is 500
  err.status = err.status || 'error'; // If the error status is not defined the default is 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    // Manually copy non-enumerable properties
    error.message = err?.message;
    error.name = err?.name;
    error.code = err?.code;
    error.errmsg = err?.errmsg;

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
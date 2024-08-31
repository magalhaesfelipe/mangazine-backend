import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

// Listening and Catching Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!😭 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
const port = process.env.PORT || 5000;

if (!DB) {
  throw new Error(
    'Database connection string is not defined in environment variables. ',
  );
}

mongoose.connect(DB).then(() => console.log('DB connected successfully'));
const server = app.listen(port, () => {
  console.log(`App running on PORT ${port}`);
});

// Listening to the unhandled rejection event
process.on('unhandledRejection', (err: any) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!😭 Shutting down...');
  // By using server.close() we give the server time to finish all the request that are still pending or being handled at the time and then the server is killed
  server.close(() => {
    process.exit(1); // 0 stands for success, 1 stands for uncaught exception
  });
});

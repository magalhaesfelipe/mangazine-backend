import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

// Error handler
process.on('uncaughtException', (err) => {
  const msg = `UNCAUGHTEXCEPTION📢! Shutting down... ${err.name}, ${err.message}.`;
  console.log(msg);
  process.exit(1);
});

// Application code
dotenv.config();
const DB = process.env.DATABASE;
const port = process.env.PORT || 5000;

if (!DB) {
  throw new Error(
    'Database connection string is not defined in environment variables. ',
  );
}

// Connect to database
mongoose.connect(DB).then(() => console.log('DB connected successfully'));

// Start server
const server = app.listen(port, () => {
  console.log(`🟢 App running on PORT ${port}`);
});

// Handling unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  console.log(
    `UNHANDLED REJECTION📢! Shutting down. ${err.name}, ${err.message}.`,
  );
  server.close(() => {
    process.exit(1); // 0 stands for success, 1 stands for uncaught exception
  });
});

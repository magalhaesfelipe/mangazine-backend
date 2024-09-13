import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

<<<<<<< HEAD
// Error handler
=======
// ERROR HANDLER
>>>>>>> b51f53ed5951d4c1c960bed11e6262699ae2fb29
process.on('uncaughtException', (err) => {
  const msg = `UNCAUGHTEXCEPTION📢! Shutting down... ${err.name}, ${err.message}.`;
  console.log(msg);
  process.exit(1);
});

<<<<<<< HEAD
// Application code
dotenv.config();
=======
dotenv.config({ path: './config.env' });
>>>>>>> b51f53ed5951d4c1c960bed11e6262699ae2fb29
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
<<<<<<< HEAD
  console.log(
    `UNHANDLED REJECTION📢! Shutting down. ${err.name}, ${err.message}.`,
  );
=======
  console.log(`UNHANDLED REJECTION📢! Shutting down. ${err.name}, ${err.message}.`,);
  // By using server.close() we give the server time to finish all the request that are still pending or being handled at the time and then the server is killed
>>>>>>> b51f53ed5951d4c1c960bed11e6262699ae2fb29
  server.close(() => {
    process.exit(1); // 0 stands for success, 1 stands for uncaught exception
  });
});

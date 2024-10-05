import express from 'express';
import {
  createUser,
  getUserById,
  getUserLists,
} from '../controllers/userController.js';

const router = express.Router();

// Register user
router.route('/').post(createUser);

// Get user
router.route('/:userId').get(getUserById);

// Get user lists
router.route('/:userId/lists').get(getUserLists);

export default router;

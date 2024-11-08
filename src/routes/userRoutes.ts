import express from 'express';
import { createUser, getUserById } from '../controllers/userController.js';
import { getAllLists } from '../controllers/listController.js';

const router = express.Router();

// Register user
router.route('/').post(createUser);

// Get user
router.route('/:userId').get(getUserById);

export default router;

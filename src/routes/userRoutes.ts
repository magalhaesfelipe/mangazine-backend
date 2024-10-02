import express from 'express';
import {
  createUser,
  checkUserExists,
  getUserRole,
  getLists,
} from '../controllers/userController.js';

const router = express.Router();
/* router.route('/').get(userController.getAllUsers); */

// Register user
router.route('/signup').post(createUser);

// Check if user exists
router.route('/exists/:userId').get(checkUserExists);

// Get user role
router.route('/get-role/:userId').get(getUserRole);

// Get user lists
router.route('/lists/:userId').get(getLists);

export default router;

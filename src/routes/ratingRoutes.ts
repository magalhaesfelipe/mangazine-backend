import express from 'express';
import {
  getRating,
  getAverageRating,
  createRating,
  deleteRating,
} from '../controllers/ratingController.js';

const router = express.Router();

// Get a user's rating for a specific item
router.route('/user/:userId/item/:itemId').get(getRating);

// Create or update rating
router.route('/').post(createRating);

// Delete a user's rating for a specific item
router.route('/user/:userId/item/:itemId').delete(deleteRating);

// Get average rating
router.route('/item/:itemId/average').get(getAverageRating);


export default router;

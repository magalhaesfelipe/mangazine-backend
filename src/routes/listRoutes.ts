import express from 'express';
import {
  checkItemExists,
  getListById,
  createList,
  addToList,
  removeFromList,
  getAllLists,
  deleteList,
} from '../controllers/listController.js';

const router = express.Router();

// Get and Delete list by ID
router.route('/:listId').get(getListById).delete(deleteList);

// Get all lists of an user
router.route('/user/:userId').get(getAllLists);

// Check if an item exists in a list
router.route('/:listId/item/:itemId/exists').get(checkItemExists);

// Create list
router.route('/').post(createList);

// Add item to the list
router.route('/:listId/items/add').patch(addToList);

// Remove item from list
router.route('/:listId/item/:itemId/remove').patch(removeFromList);

export default router;

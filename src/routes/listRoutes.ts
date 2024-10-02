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

// Checks if item exists in the list
router.route('/:listId/item/:itemId/exists').get(checkItemExists);

// Get all lists
router.route('/get-all-lists/:userId').get(getAllLists);

// Get list by ID
router.route('/get-list/:listId').get(getListById);

// Create list
router.route('/create-list').post(createList);

// Delete list
router.route('/delete-list/:listId').delete(deleteList);

// Add to list
router.route('/:listId/add-to-list/:itemId').patch(addToList);

// Remove from list
router.route('/:listId/remove-from-list/:itemId').patch(removeFromList);

export default router;

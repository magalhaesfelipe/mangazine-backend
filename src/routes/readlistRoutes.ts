import express from 'express';
import {
  getReadlist,
  checkItemExistsInReadlist,
  addToReadlist,
  removeItemFromReadlist,
} from '../controllers/readlistController.js';

const router = express.Router();

router.route('/:userId').get(getReadlist);

router
  .route('/:userId/items/:itemId')
  .get(checkItemExistsInReadlist)
  .post(addToReadlist)
  .delete(removeItemFromReadlist);

export default router;

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
  .route('/:userId/item/:itemId')
  .get(checkItemExistsInReadlist)
  .patch(addToReadlist)
  .delete(removeItemFromReadlist);

export default router;

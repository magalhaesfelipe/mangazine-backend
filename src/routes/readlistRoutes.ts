import express from 'express';
import {
  getReadlist,
  checkItemExistsInReadlist,
  addToReadlist,
  removeItemFromReadlist,
  createReadlist,
} from '../controllers/readlistController.js';

const router = express.Router();

router.route('/:userId').get(getReadlist);

router.route('/:userId').post(createReadlist).patch(addToReadlist);

router
  .route('/:userId/item/:itemId')
  .get(checkItemExistsInReadlist)
  .delete(removeItemFromReadlist);

export default router;

import express from 'express';
import {
  getAllMangas,
  getMangaById,
  getMangaByName,
  updateManga,
  createManga,
  deleteManga,
  getMangaByAuthor,
} from '../controllers/mangaController.js';

const router = express.Router();

router.route('/').get(getAllMangas).post(createManga);
router.route('/search/by-name').get(getMangaByName);
router.route('/search/by-author').get(getMangaByAuthor);

router
  .route('/:itemId')
  .get(getMangaById)
  .patch(updateManga)
  .delete(deleteManga);

export default router;

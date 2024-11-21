import express from 'express';
import {
  getAllMangas,
  getMangaById,
  getMangaByName,
  updateManga,
  createManga,
  deleteManga,
} from '../controllers/mangaController.js';

const router = express.Router();

router.route('/').get(getAllMangas).post(createManga);
router.route('/search').get(getMangaByName);

router
  .route('/:itemId')
  .get(getMangaById)
  .patch(updateManga)
  .delete(deleteManga);


export default router;

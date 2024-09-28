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

router.route('/get-all-mangas').get(getAllMangas);
router.route('/:mangaId').get(getMangaById);
router.route('/search/:mangaName').get(getMangaByName);
router.route('/update-manga/:mangaId').patch(updateManga);
router.route('/create-manga').post(createManga);
router.route('/delete/:mangaId').delete(deleteManga);

export default router;

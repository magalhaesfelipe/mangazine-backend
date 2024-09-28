import express from "express";
import { getAuthorById } from "../controllers/authorController.js";

const router = express.Router();

router.route('/:authorId').get(getAuthorById);

export default router;


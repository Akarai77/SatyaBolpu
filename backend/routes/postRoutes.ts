import express from 'express';
import { uploadPost } from '../controllers/PostController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',authMiddleware,uploadPost);

export default router;

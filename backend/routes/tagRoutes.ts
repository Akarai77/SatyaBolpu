import express from 'express';
import { addTag, getTags } from '../controllers/tagController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',getTags);
router.post('/',authMiddleware,addTag);

export default router;

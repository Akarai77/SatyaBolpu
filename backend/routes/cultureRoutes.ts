import express from 'express';
import { getCulture, getCultures, uploadCulture } from '../controllers/cultureController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',getCultures);
router.get('/:name',getCulture);
router.post('/',authMiddleware,uploadCulture);

export default router;

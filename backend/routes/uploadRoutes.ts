import express from 'express';
import { uploadController } from '../controllers/UploadController.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();
router.post('/',upload.single('file'),uploadController);

export default router;

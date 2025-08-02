import express from 'express';
import { login, logout, refresh, signup } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/login',login);
router.post('/signup',signup);
router.post('/refresh',refresh);
router.post('/logout',logout);

export default router;

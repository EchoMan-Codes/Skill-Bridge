import express from 'express';
import { postGenerate } from '../controllers/roadmapController.js';

const router = express.Router();
router.post('/generate', postGenerate);

export default router;

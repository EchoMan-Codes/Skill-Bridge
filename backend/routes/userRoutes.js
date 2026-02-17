import express from 'express';
import { postAssessment, getRecent } from '../controllers/userController.js';

const router = express.Router();
router.get('/recent', getRecent);
router.post('/assessment', postAssessment);

export default router;

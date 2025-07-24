import express from 'express';
import checkQuestionsRoutes from './checker/index.js';

const router = express.Router();

// Register route modules
router.use('/checkQuestions', checkQuestionsRoutes);

export default router;

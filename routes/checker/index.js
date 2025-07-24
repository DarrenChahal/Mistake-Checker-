import express from 'express';
import checkerController from '../../controllers/checker.js';

const router = express.Router();

// Question endpoints
router.post('/', checker.checkQuestions);


export default router;

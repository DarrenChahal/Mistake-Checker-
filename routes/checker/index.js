import express from 'express';
import checkerController from '../../controllers/checker.js';

const router = express.Router();

// Question endpoints
router.post('/', checkerController.checkQuestions);


export default router;

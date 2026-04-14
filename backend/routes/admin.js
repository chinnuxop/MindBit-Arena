import express from 'express';
import { getStats} from '../controllers/userController.js';
import {deleteQuiz,getAllQuizzes,uploadQuiz} from '../controllers/adminController.js';

const router= express.Router();

router.post("/upload-quiz",uploadQuiz);

router.get("/stats",getStats);
router.get("/quizzes",getAllQuizzes);
router.delete("/quiz/:id",deleteQuiz);

export default router;


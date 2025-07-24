import BlueBirdPromise from 'bluebird';
import { validateQuestions } from '../validators/questionsValidator.js';
import { questionService } from '../services/checker.js';

export const checkerController = {
  checkQuestions: async (req, res) => {
    const questions = req.body;

    const validationResult = validateQuestions(questions);
    if (!validationResult.isValid) {
      return res.status(400).json({
        message: "Validation errors",
        errors: validationResult.errors
      });
    }

    try {
      await BlueBirdPromise.map(questions, async (question) => {
        const result = await questionService.evaluateResponse({
          question: question.question,
          userAnswer: question.user_response,
          correctAnswer: question.correct_answer
        });
        question.result = result;
      }, { concurrency: 30 });

      await questionService.logEvaluatedQuestions(questions);

      return res.status(200).json({
        message: "Questions evaluated and stored successfully",
        questions: questions
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal error while evaluating/storing",
        error: error.message
      });
    }
  }
};

export default checkerController;

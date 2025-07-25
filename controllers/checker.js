import BlueBirdPromise from 'bluebird';
import { validateQuestions } from '../validators/questionsValidator.js';
import { questionService } from '../services/checker.js';
import { formatNotificationMessage } from '../utils.js';
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
      const chatId = process.env.TELEGRAM_CHAT_ID;
      
      const message = formatNotificationMessage(questions);
      if (message.length < 4000) {
        await questionService.sendNotification(message, chatId);
      } else {
        for (const q of questions) {
          const singleMessage = formatNotificationMessage([q]);
          await questionService.sendNotification(singleMessage, chatId);
        }
      }

      // when scaling keep these in mind
//       In a single chat, avoid sending more than one message per second. We may allow short bursts that go over this limit, but eventually you'll begin receiving 429 errors.
// In a group, bots are not be able to send more than 20 messages per minute.

      return res.status(200).json({
        message: "Questions evaluated and stored successfully",
        questions: questions
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal error while evaluating/storing/sending notifications",
        error: error.message
      });
    }
  }
};

export default checkerController;

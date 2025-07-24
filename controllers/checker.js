import { validateQuestions } from '../validators/questionsValidator.js';
import { questionService } from '../services/checker.js';

export  const checkerController = {
    
    checkQuestions: async (req, res) => {
        const questions = req.body;

        // Validate the questions using the imported validator
        const validationResult = validateQuestions(questions);

        if (!validationResult.isValid) {
            return res.status(400).json({
                message: "Validation errors",
                errors: validationResult.errors
            });    
        }

        for(const question of questions) {
            try {
                console.log("Evaluating question:", question);
                const result = await questionService.evaluateResponse({
                    question: question.question,
                    userAnswer: question.user_response,
                    correctAnswer: question.correct_answer
                });

                // Add result to the question object
                console.log("Evaluation result:", result);
                question.result = result;
            } catch (error) {
                return res.status(500).json({
                    message: "Error evaluating response",
                    error: error.message
                });
            }
        }
        return res.status(200).json({
            message: "Questions evaluated successfully",
            questions: questions
        });

    }

};

export default checkerController;
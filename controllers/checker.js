import { validateQuestions } from "../validators/questionsValidator";

export const questionController = {
    
    checkQuestions: async (req, res) => {
        const { questions } = req.body;

        // Validate the questions using the imported validator
        const validationResult = validateQuestions(questions);

        if (!validationResult.isValid) {
            return res.status(400).json({
                message: "Validation errors",
                errors: validationResult.errors
            });    
        }

    }

};

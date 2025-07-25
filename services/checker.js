import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import notificationService from "./notification.js";
import database from "./database.js";
import { getGeminiEvaluation } from "./model.js";

// Load YAML prompt
const prompts = yaml.load(fs.readFileSync(path.resolve("config/aiPrompts.yaml"), "utf8"));

// Utility: Check numeric ±10% tolerance
function isWithin10PercentNumeric(userAns, correctAns) {
  const u = parseFloat(userAns);
  const c = parseFloat(correctAns);
  if (isNaN(u) || isNaN(c)) return false;

  const lower = c * 0.9;
  const upper = c * 1.1;
  return u >= lower && u <= upper;
}

export const questionService = {
  async evaluateResponse({ question, userAnswer, correctAnswer }) {
    let isCorrect = false;

    const questionType = question.question_type;

    // Match for MCQ
    if (questionType === "mcq") {
      isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    }

    // Match for input (numeric ±10%)
    else if (questionType === "input") {
      isCorrect = isWithin10PercentNumeric(userAnswer, correctAnswer);
    }

    if (isCorrect) {
      return {
        isCorrect: true,
        message: "Correct answer!"
      };
    }

    // Extract question text properly
    const questionText = typeof question === 'object' ? 
      (question.question || question.text || question.content || JSON.stringify(question)) : 
      question;

    // If incorrect, ask Gemini for explanation
    const prompt = prompts.evaluateResponsePrompt
      .replace("{{question}}", questionText)
      .replace("{{userAnswer}}", userAnswer)
      .replace("{{correctAnswer}}", correctAnswer);

    const feedback = await getGeminiEvaluation(prompt);

    return {
      isCorrect: false,
      ...feedback
    };
  },

  async logEvaluatedQuestions(questions) {
    database.logEvaluatedQuestions(questions)
      .then(() => console.log("Evaluated questions logged successfully"))
      .catch(error => console.error("Error logging evaluated questions:", error));
  },

  async sendNotification(message, chatId) {
    if (!chatId) {
      throw new Error("Chat ID is required to send a notification.");
    }
    return notificationService.sendNotification(message, chatId);
  }

};

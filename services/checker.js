import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";

import dotenv from "dotenv";

// Load environment variables
dotenv.config();
import database from "./database.js";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    try {
      const aiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let feedback;
      const responseText = aiResponse.text || aiResponse.response?.text() || '';
      
      // Try to extract JSON from the response if it's wrapped in markdown
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : responseText;

      try {
        feedback = JSON.parse(jsonString);
      } catch (parseErr) {
        // If JSON parsing fails, create a structured response from the text
        feedback = {
          explanation: responseText,
          revisionAdvice: "Please review the concept and try again.",
          difficulty: "unknown",
          bloomsLevel: "unknown"
        };
      }

      return {
        isCorrect: false,
        ...feedback
      };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return {
        isCorrect: false,
        explanation: "Unable to generate explanation at this time.",
        revisionAdvice: "Please review the concept and try again.",
        difficulty: "unknown",
        bloomsLevel: "unknown"
      };
    }
  },

  async logEvaluatedQuestions(questions) {
    database.logEvaluatedQuestions(questions)
      .then(() => console.log("Evaluated questions logged successfully"))
      .catch(error => console.error("Error logging evaluated questions:", error));
  }


};
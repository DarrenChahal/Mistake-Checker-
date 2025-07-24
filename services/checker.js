import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import fs from "fs";
import yaml from "js-yaml";
import path from "path";

// Load env vars
dotenv.config();

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
  async evaluateResponse({ question, userAnswer, correctAnswer, questionType }) {
    let isCorrect = false;

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

    // If incorrect, ask Gemini for explanation
    const prompt = prompts.evaluateResponsePrompt
      .replace("{{question}}", question)
      .replace("{{userAnswer}}", userAnswer)
      .replace("{{correctAnswer}}", correctAnswer);

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let feedback;
    try {
      feedback = JSON.parse(aiResponse.text);
    } catch (err) {
      feedback = {
        explanation: aiResponse.text,
        revisionAdvice: "",
        difficulty: "",
        bloomsLevel: ""
      };
    }

    return {
      isCorrect: false,
      ...feedback
    };
  }
};

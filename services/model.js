// model.js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getGeminiEvaluation(prompt, model = "gemini-2.5-flash") {
  try {
    const aiResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const responseText = aiResponse.text || aiResponse.response?.text() || '';

    // Try to extract JSON if wrapped in markdown
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : responseText;

    try {
      return JSON.parse(jsonString);
    } catch {
      return {
        explanation: responseText,
        revisionAdvice: "Please review the concept and try again.",
        difficulty: "unknown",
        bloomsLevel: "unknown"
      };
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      explanation: "Unable to generate explanation at this time.",
      revisionAdvice: "Please review the concept and try again.",
      difficulty: "unknown",
      bloomsLevel: "unknown"
    };
  }
}


import { GoogleGenerativeAI } from "@google/generative-ai"; // Updated import name
import 'dotenv/config';

// Initialize the SDK with the correct property name: apiKey
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
  try {
    // Note: You need to specify the model version correctly
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = "Explain how AI works in a few words";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(response.text());
  } catch (error) {
    console.error("Error details:", error.message);
  }
}

main();
import { GoogleGenerativeAI } from "@google/generative-ai"; // ✅ Added missing import
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview", // ✅ Fixed invalid model name
    systemInstruction: "You are a helpful assistant. Your first response to a user should always be polite."
});

// ✅ Signature now accepts (message, history) and returns the full response string
// ✅ All res/req handling removed — that belongs in the router
export const getGeminiResponse = async (message, history = []) => {
    const chat = model.startChat({ history });

    const result = await chat.sendMessageStream(message);

    let fullResponse = "";
    for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText; // ✅ Fixed: was never accumulating
    }

    return fullResponse;
};
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize the Google AI Client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// 2. Define the System Instruction (The Bot's Personality)
const SYSTEM_INSTRUCTION = `
You are a helpful Thailand travel assistant. 
You help travelers with questions about visiting Thailand — including visa info, 
top destinations, local customs, food, transport, safety, packing, currency, and more. 
Be friendly, concise, and practical. If a question is unrelated to travel or Thailand, 
gently redirect the conversation back to travel topics.
`;

// 3. Initialize Model with System Instructions
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION
});

/**
 * Sends a message to Gemini and gets a response with retry logic for 503 errors.
 * @param {string | Array} input - A string prompt or an array of conversation contents.
 * @param {number} retries - Number of retries for 503/429 errors.
 */
export const getGeminiResponse = async (input, retries = 3) => {
    try {
        let result;
        if (Array.isArray(input)) {
            // If input is an array, assume it's the conversation history format
            // The model is already initialized with system instruction, so we just send contents
            result = await model.generateContent({ contents: input });
        } else {
            // Otherwise, treat as a simple string prompt
            result = await model.generateContent(input);
        }

        const response = await result.response;
        return response.text();

    } catch (error) {
        // Check for 503 (Service Unavailable) or 429 (Rate Limit)
        if ((error.message?.includes("503") || error.message?.includes("429")) && retries > 0) {
            console.warn(`Model busy or rate limited. Retrying... (${retries} attempts left)`);

            // Wait 2 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
            return getGeminiResponse(input, retries - 1);
        }

        console.error("Gemini API Error:", error);
        return "Sorry, the AI is currently unavailable. Please try again later.";
    }
};
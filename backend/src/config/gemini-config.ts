import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Google Generative AI library

// Function to configure Google Generative AI
export const configureGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY; // Make sure to set your API key in the environment variables

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  const geminiClient = new GoogleGenerativeAI(apiKey); // Create an instance with the API key
  return geminiClient;
};

// OpenAI configuration example (commented out)
/*
import { Configuration } from "openai";

export const configureOpenAI = () => {
  const config = new Configuration({
    apiKey: process.env.OPEN_AI_SECRET,
    organization: process.env.OPENAI_ORGANIZATION_ID,
  });

  if (!process.env.OPEN_AI_SECRET || !process.env.OPENAI_ORGANIZATION_ID) {
    throw new Error('OpenAI API Key or Organization ID is missing');
  }

  return config;
};
*/

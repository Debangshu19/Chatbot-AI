import { GoogleGenerativeAI } from "@google/generative-ai";

export const configureGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY; // Make sure to set your API key in your environment variables
  const configureGemini = new GoogleGenerativeAI(apiKey);
  return configureGemini;
};
/*
import { Configuration } from "openai";

export const configureOpenAI = () => {
  const config = new Configuration({
    apiKey: process.env.OPEN_AI_SECRET,
    organization: process.env.OPENAI_ORAGANIZATION_ID,
  });
  return config;
};
*/
import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { configureGemini } from "../config/gemini-config";
// Uncomment if you want to switch to OpenAI
// import { configureOpenAI } from "../config/openai-config";
// import { OpenAIApi, ChatCompletionRequestMessage } from "openai";

// Generate chat completion using Google Gemini AI
export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {
    // Find user from JWT
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
    }

    // Get user's chat history
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    }));

    // Initialize Google Gemini AI
    const genAI = configureGemini();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate a response from Gemini
    const result = await model.generateContent(message);
    const generatedMessage = result.response.text(); // Extract the generated response

    // Store the user message and AI response
    user.chats.push({ content: message, role: "user" });
    user.chats.push({ content: generatedMessage, role: "assistant" });
    await user.save();

    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Send user's chats
export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Find user by ID
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    // Verify user permissions
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong", cause: error.message });
  }
};

// Delete user's chats
export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Find user by ID
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    // Verify user permissions
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    
    // Clear user's chat history
    user.chats = [];
    await user.save();

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong", cause: error.message });
  }
};

// If needed, you can uncomment the OpenAI version
/*
export const generateChatCompletionOpenAI = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) return res.status(401).json({ message: "User not registered OR Token malfunctioned" });

    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    })) as ChatCompletionRequestMessage[];

    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    const config = configureOpenAI();
    const openai = new OpenAIApi(config);

    const chatResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chats,
    });

    const assistantMessage = chatResponse.data.choices[0].message;

    user.chats.push(assistantMessage);
    await user.save();

    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
*/


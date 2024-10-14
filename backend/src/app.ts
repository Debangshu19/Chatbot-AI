import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config();
const app = express();

app.use(express.json()); 

//middlewares
const corsOptions = {
    origin: 'https://chatbot-ai-two.vercel.app', // your frontend origin
    credentials: true, // allow cookies to be sent
};
app.use(cors(corsOptions)); // Apply CORS to all routes
app.options('*', cors(corsOptions)); // Handle preflight requests
  
app.use(cookieParser(process.env.COOKIE_SECRET));

//remove it in production
//app.use(morgan("dev"));

app.use("/api/v1", appRouter);

export default app;

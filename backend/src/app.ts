import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config(); // Load environment variables
const app = express();

// Middlewares
app.use(express.json());

// Update CORS settings for deployment
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Use environment variable for flexibility
    credentials: true, // allow cookies to be sent
};
app.use(cors(corsOptions)); // Apply CORS to all routes
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(cookieParser(process.env.COOKIE_SECRET)); // Ensure COOKIE_SECRET is defined in environment variables

// Logger: remove it in production if not needed
if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"));
}

// Routes
app.use("/api/v1", appRouter);

export default app;

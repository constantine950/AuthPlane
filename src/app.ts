import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";
import { generalRateLimit } from "./middleware/rateLimit.middleware";

const app = express();

// Trust nginx/reverse proxy
app.set("trust proxy", 1);

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Rate limiting
if (process.env.NODE_ENV !== "test") {
  app.use(generalRateLimit);
}

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth service is running",
  });
});

// Global error handler
app.use(errorHandler);

export default app;

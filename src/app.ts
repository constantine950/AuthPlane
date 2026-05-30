import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/index";
import { errorHandler } from "./middleware/error.middleware";
import { generalRateLimit } from "./middleware/rateLimit.middleware";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allows cookies to be sent
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(generalRateLimit);
app.use("/api", routes);

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Auth service is running" });
});

app.use(errorHandler);

export default app;

import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/index";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Auth service is running" });
});

app.use(errorHandler);

export default app;

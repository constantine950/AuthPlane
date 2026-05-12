import express from "express";
import routes from "./routes/index";

const app = express();

app.use(express.json());
app.use("/api", routes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Auth service is running" });
});

export default app;

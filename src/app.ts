import cors from "cors";
import express from "express";
import helmet from "helmet";

import morgan from "morgan";
import api from "./routes";
import "dotenv/config";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get<{}, { message: string }>("/", (req, res) => {
  res.json({
    message: "Glofy Deals API",
  });
});

app.use("/api/v1", api);

export default app;

import express from "express";
import cors from "cors";
import "dotenv/config";
import taskRoutes from "./routes/taskRoutes.js";
import { initDb } from "./config/db.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

initDb();

app.use("/api", taskRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Lista de Tarefas Online" });
});

export default app;

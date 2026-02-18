import express from "express";
import cors from "cors";
import "dotenv/config";
import routes from "./routes.js";
import { initDb } from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

initDb();

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ message: "API Lista de Tarefas Online" });
});

export default app;

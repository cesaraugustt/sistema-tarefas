import express from "express";
import TaskController from "../controllers/TaskController.js";

const router = express.Router();

router.get("/tarefas", TaskController.getAll);
router.post("/tarefas", TaskController.create);
router.put("/tarefas/:id", TaskController.update);
router.delete("/tarefas/:id", TaskController.delete);
router.patch("/tarefas/:id/ordem", TaskController.updateOrder);

export default router;

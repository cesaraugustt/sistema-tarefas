import TaskModel from "../models/TaskModel.js";

const TaskController = {
  getAll: async (req, res) => {
    try {
      const tasks = await TaskModel.findAll();
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar tarefas" });
    }
  },

  create: async (req, res) => {
    const { nome, custo, data_limite } = req.body;
    try {
      const newTask = await TaskModel.create(nome, custo, data_limite);
      res.status(201).json(newTask);
    } catch (err) {
      if (err.code === "23505") {
        return res
          .status(400)
          .json({ error: "Já existe uma tarefa com este nome." });
      }
      res.status(500).json({ error: "Erro ao incluir tarefa" });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { nome, custo, data_limite } = req.body;
    try {
      const updatedTask = await TaskModel.update(id, nome, custo, data_limite);
      if (!updatedTask)
        return res.status(404).json({ error: "Tarefa não encontrada" });
      res.json(updatedTask);
    } catch (err) {
      if (err.code === "23505")
        return res.status(400).json({ error: "Nome já em uso." });
      res.status(500).json({ error: "Erro ao editar tarefa" });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await TaskModel.delete(id);
      if (!deleted)
        return res.status(404).json({ error: "Tarefa não encontrada" });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: "Erro ao excluir tarefa" });
    }
  },

  updateOrder: async (req, res) => {
    const { id } = req.params;
    const { direcao } = req.body;

    try {
      const result = await TaskModel.reorder(id, direcao);
      if (result && result.error) {
        return res.status(result.status).json({ error: result.error });
      }
      res.json({ message: "Ordem atualizada com sucesso" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao reordenar" });
    }
  },
};

export default TaskController;

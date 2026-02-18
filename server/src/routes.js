import express from "express";
import pool from "./db.js";

const router = express.Router();

router.get("/tarefas", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Tarefas ORDER BY ordem_apresentacao ASC",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
});

router.post("/tarefas", async (req, res) => {
  const { nome, custo, data_limite } = req.body;
  try {
    const maxOrderResult = await pool.query(
      "SELECT MAX(ordem_apresentacao) FROM Tarefas",
    );
    const nextOrder = (maxOrderResult.rows[0].max || 0) + 1;

    const result = await pool.query(
      "INSERT INTO Tarefas (nome, custo, data_limite, ordem_apresentacao) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, custo, data_limite, nextOrder],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res
        .status(400)
        .json({ error: "Já existe uma tarefa com este nome." });
    }
    res.status(500).json({ error: "Erro ao incluir tarefa" });
  }
});

router.put("/tarefas/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, custo, data_limite } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Tarefas SET nome = $1, custo = $2, data_limite = $3 WHERE id = $4 RETURNING *",
      [nome, custo, data_limite, id],
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Tarefa não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505")
      return res.status(400).json({ error: "Nome já em uso." });
    res.status(500).json({ error: "Erro ao editar tarefa" });
  }
});

router.delete("/tarefas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM Tarefas WHERE id = $1", [id]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Tarefa não encontrada" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir tarefa" });
  }
});

router.patch("/tarefas/:id/ordem", async (req, res) => {
  const { id } = req.params;
  const { direcao } = req.body;

  try {
    const tarefaAtualResult = await pool.query(
      "SELECT id, ordem_apresentacao FROM Tarefas WHERE id = $1",
      [id],
    );
    if (tarefaAtualResult.rowCount === 0)
      return res.status(404).json({ error: "Tarefa não encontrada" });

    const tarefaAtual = tarefaAtualResult.rows[0];
    let queryVizinho = "";

    if (direcao === "subir") {
      queryVizinho =
        "SELECT id, ordem_apresentacao FROM Tarefas WHERE ordem_apresentacao < $1 ORDER BY ordem_apresentacao DESC LIMIT 1";
    } else {
      queryVizinho =
        "SELECT id, ordem_apresentacao FROM Tarefas WHERE ordem_apresentacao > $1 ORDER BY ordem_apresentacao ASC LIMIT 1";
    }

    const vizinhoResult = await pool.query(queryVizinho, [
      tarefaAtual.ordem_apresentacao,
    ]);
    if (vizinhoResult.rowCount === 0)
      return res
        .status(400)
        .json({ error: "Não é possível mover nessa direção" });

    const vizinho = vizinhoResult.rows[0];

    await pool.query("BEGIN");
    await pool.query(
      "UPDATE Tarefas SET ordem_apresentacao = $1 WHERE id = $2",
      [vizinho.ordem_apresentacao, tarefaAtual.id],
    );
    await pool.query(
      "UPDATE Tarefas SET ordem_apresentacao = $1 WHERE id = $2",
      [tarefaAtual.ordem_apresentacao, vizinho.id],
    );
    await pool.query("COMMIT");

    res.json({ message: "Ordem atualizada com sucesso" });
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: "Erro ao reordenar" });
  }
});

export default router;

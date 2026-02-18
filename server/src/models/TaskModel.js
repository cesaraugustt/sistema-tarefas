import pool from "../config/db.js";

const TaskModel = {
  findAll: async () => {
    const result = await pool.query(
      "SELECT * FROM Tarefas ORDER BY ordem_apresentacao ASC",
    );
    return result.rows;
  },

  create: async (nome, custo, data_limite) => {
    const maxOrderResult = await pool.query(
      "SELECT MAX(ordem_apresentacao) FROM Tarefas",
    );
    const nextOrder = (maxOrderResult.rows[0].max || 0) + 1;

    const result = await pool.query(
      "INSERT INTO Tarefas (nome, custo, data_limite, ordem_apresentacao) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, custo, data_limite, nextOrder],
    );
    return result.rows[0];
  },

  update: async (id, nome, custo, data_limite) => {
    const result = await pool.query(
      "UPDATE Tarefas SET nome = $1, custo = $2, data_limite = $3 WHERE id = $4 RETURNING *",
      [nome, custo, data_limite, id],
    );
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query("SELECT * FROM Tarefas WHERE id = $1", [id]);
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query("DELETE FROM Tarefas WHERE id = $1", [id]);
    return result.rowCount > 0;
  },

  findNeighbor: async (currentOrder, direction) => {
    let queryVizinho = "";
    if (direction === "subir") {
      queryVizinho =
        "SELECT id, ordem_apresentacao FROM Tarefas WHERE ordem_apresentacao < $1 ORDER BY ordem_apresentacao DESC LIMIT 1";
    } else {
      queryVizinho =
        "SELECT id, ordem_apresentacao FROM Tarefas WHERE ordem_apresentacao > $1 ORDER BY ordem_apresentacao ASC LIMIT 1";
    }
    const result = await pool.query(queryVizinho, [currentOrder]);
    return result.rows[0];
  },

  updateOrder: async (id, newOrder) => {
    await pool.query("UPDATE Tarefas SET ordem_apresentacao = $1 WHERE id = $2", [
      newOrder,
      id,
    ]);
  },


  reorder: async (id, direcao) => {
      const client = await pool.connect();
      try {
          await client.query("BEGIN");
          
          const tarefaAtualResult = await client.query(
              "SELECT id, ordem_apresentacao FROM Tarefas WHERE id = $1",
              [id]
          );
          
          if (tarefaAtualResult.rowCount === 0) {
              await client.query("ROLLBACK");
              return { error: "Tarefa não encontrada", status: 404 };
          }
          
          const tarefaAtual = tarefaAtualResult.rows[0];
          let queryVizinho = "";

          if (direcao === "subir") {
            queryVizinho =
              "SELECT id, ordem_apresentacao FROM Tarefas WHERE ordem_apresentacao < $1 ORDER BY ordem_apresentacao DESC LIMIT 1";
          } else {
            queryVizinho =
              "SELECT id, ordem_apresentacao FROM Tarefas WHERE ordem_apresentacao > $1 ORDER BY ordem_apresentacao ASC LIMIT 1";
          }

          const vizinhoResult = await client.query(queryVizinho, [
            tarefaAtual.ordem_apresentacao,
          ]);

          if (vizinhoResult.rowCount === 0) {
              await client.query("ROLLBACK");
              return { error: "Não é possível mover nessa direção", status: 400 };
          }

          const vizinho = vizinhoResult.rows[0];

          await client.query(
            "UPDATE Tarefas SET ordem_apresentacao = $1 WHERE id = $2",
            [vizinho.ordem_apresentacao, tarefaAtual.id],
          );
          await client.query(
            "UPDATE Tarefas SET ordem_apresentacao = $1 WHERE id = $2",
            [tarefaAtual.ordem_apresentacao, vizinho.id],
          );
          
          await client.query("COMMIT");
          return { success: true };
      } catch (err) {
          await client.query("ROLLBACK");
          throw err;
      } finally {
          client.release();
      }
  }
};

export default TaskModel;

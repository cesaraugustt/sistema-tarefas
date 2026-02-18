import request from "supertest";
import app from "../src/app.js";
import pool, { initDb } from "../src/config/db.js";

describe("API de Tarefas - CRUD e Reordenação", () => {
  beforeAll(async () => {
    await initDb();
    await pool.query("TRUNCATE TABLE Tarefas RESTART IDENTITY");
  });

  afterAll(async () => {
    await pool.end();
  });

  let tarefaId;

  // --- TESTE DE CRIAÇÃO ---
  it("Deve criar uma nova tarefa com sucesso", async () => {
    const res = await request(app).post("/api/tarefas").send({
      nome: "Tarefa Teste",
      custo: 150.5,
      data_limite: "2026-12-31",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.nome).toBe("Tarefa Teste");
    tarefaId = res.body.id;
  });

  it("Não deve permitir tarefas com o mesmo nome", async () => {
    const res = await request(app).post("/api/tarefas").send({
      nome: "Tarefa Teste", // Nome repetido
      custo: 10,
      data_limite: "2026-01-01",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Já existe uma tarefa com este nome.");
  });

  // --- TESTE DE LISTAGEM ---
  it("Deve listar as tarefas ordenadas por ordem_apresentacao", async () => {
    const res = await request(app).get("/api/tarefas");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  // --- TESTE DE EDIÇÃO ---
  it("Deve editar uma tarefa existente", async () => {
    const res = await request(app).put(`/api/tarefas/${tarefaId}`).send({
      nome: "Tarefa Editada",
      custo: 2000,
      data_limite: "2026-11-30",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.nome).toBe("Tarefa Editada");
    expect(Number(res.body.custo)).toBe(2000);
  });

  // --- TESTE DE REORDENAÇÃO (O MAIS IMPORTANTE) ---
  it("Deve trocar a ordem entre duas tarefas (Subir)", async () => {
    // 1. Criar uma segunda tarefa
    const res2 = await request(app)
      .post("/api/tarefas")
      .send({ nome: "Segunda Tarefa", custo: 10, data_limite: "2026-01-01" });

    const id2 = res2.body.id;

    // 2. Pedir para a segunda tarefa (id2) subir
    const resMover = await request(app)
      .patch(`/api/tarefas/${id2}/ordem`)
      .send({ direcao: "subir" });

    expect(resMover.statusCode).toBe(200);

    // 3. Verificar se na listagem ela agora é a primeira
    const resList = await request(app).get("/api/tarefas");
    expect(resList.body[0].id).toBe(id2); // A segunda tarefa agora é a primeira
  });

  // --- TESTE DE EXCLUSÃO ---
  it("Deve excluir uma tarefa", async () => {
    const res = await request(app).delete(`/api/tarefas/${tarefaId}`);
    expect(res.statusCode).toBe(204);

    const check = await request(app).get("/api/tarefas");
    expect(check.body.length).toBe(1); // Sobrou apenas a 'Segunda Tarefa'
  });
});

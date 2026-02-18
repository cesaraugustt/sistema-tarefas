import request from "supertest";
import app from "../src/app.js";

describe("Teste de Integração Básico", () => {
  it("GET / deve retornar mensagem de sucesso", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Backend funcionando!" });
  });
});

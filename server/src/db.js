import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Tarefas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL UNIQUE,
        custo NUMERIC(10, 2) NOT NULL CHECK (custo >= 0),
        data_limite DATE NOT NULL,
        ordem_apresentacao SERIAL -- Usamos serial para gerar números únicos automáticos
      );
    `);
    console.log("✅ Banco de dados pronto para uso!");
  } catch (err) {
    console.error("❌ Erro ao inicializar o banco:", err);
    process.exit(1);
  }
};

export default pool;

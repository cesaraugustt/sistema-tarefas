import { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";

function App() {
  const [tarefas, setTarefas] = useState([]);

  // Função para carregar tarefas do backend
  const carregarTarefas = async () => {
    try {
      const response = await api.get("/tarefas");
      setTarefas(response.body || response.data); // Depende de como o axios retorna
    } catch (error) {
      alert("Erro ao carregar tarefas");
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  // Formatador de Moeda (Padrão Brasileiro)
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  return (
    <div className="container">
      <h1>Lista de Tarefas</h1>

      <table className="tarefa-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Custo</th>
            <th>Data Limite</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tarefas.map((tarefa) => (
            <tr
              key={tarefa.id}
              className={Number(tarefa.custo) >= 1000 ? "highlight-row" : ""}
            >
              <td>{tarefa.id}</td>
              <td>{tarefa.nome}</td>
              <td>{formatarMoeda(tarefa.custo)}</td>
              <td>
                {new Date(tarefa.data_limite).toLocaleDateString("pt-BR")}
              </td>
              <td>
                <button title="Subir">⬆️</button>
                <button title="Descer">⬇️</button>
                <button title="Editar">✏️</button>
                <button title="Excluir">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn-add">Incluir Nova Tarefa</button>
    </div>
  );
}

export default App;

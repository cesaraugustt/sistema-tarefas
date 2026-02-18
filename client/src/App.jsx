import { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";
import TaskModal from "./components/TaskModal";

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // Função para carregar tarefas do backend
  const carregarTarefas = async () => {
    try {
      const response = await api.get("/tarefas");
      setTarefas(response.data);
    } catch (error) {
      console.error("Erro ao carregar tarefas", error);
      alert("Erro ao carregar tarefas do servidor.");
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  const abrirModalInclusao = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const abrirModalEdicao = (tarefa) => {
    setCurrentTask(tarefa);
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  const salvarTarefa = async (dadosTarefa) => {
    try {
      if (currentTask) {
        // Editando
        await api.put(`/tarefas/${currentTask.id}`, dadosTarefa);
      } else {
        // Criando
        await api.post("/tarefas", dadosTarefa);
      }
      fecharModal();
      carregarTarefas();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("Erro ao salvar tarefa.");
      }
    }
  };

  const excluirTarefa = async (id, nome) => {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir a tarefa "${nome}"?`,
    );

    if (confirmou) {
      try {
        await api.delete(`/tarefas/${id}`);
        carregarTarefas();
      } catch (error) {
        console.error(error);
        alert("Erro ao excluir a tarefa");
      }
    }
  };

  const reordenarTarefa = async (id, direcao) => {
    try {
      await api.patch(`/tarefas/${id}/ordem`, { direcao });
      carregarTarefas();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("Erro ao reordenar tarefa.");
      }
    }
  };

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
          {tarefas.map((tarefa, index) => (
            <tr
              key={tarefa.id}
              className={Number(tarefa.custo) >= 1000 ? "highlight-row" : ""}
            >
              <td>{tarefa.id}</td>
              <td>{tarefa.nome}</td>
              <td>{formatarMoeda(tarefa.custo)}</td>
              <td>
                {new Date(tarefa.data_limite).toLocaleDateString("pt-BR", {
                    timeZone: 'UTC' // Importante para datas sem hora
                })}
              </td>
              <td>
                <button
                    title="Subir"
                    onClick={() => reordenarTarefa(tarefa.id, "subir")}
                    disabled={index === 0}
                    style={{ opacity: index === 0 ? 0.3 : 1 }}
                >
                    ⬆️
                </button>
                <button
                    title="Descer"
                    onClick={() => reordenarTarefa(tarefa.id, "descer")}
                    disabled={index === tarefas.length - 1}
                     style={{ opacity: index === tarefas.length - 1 ? 0.3 : 1 }}
                >
                    ⬇️
                </button>
                <button title="Editar" onClick={() => abrirModalEdicao(tarefa)}>
                    ✏️
                </button>
                <button
                  title="Excluir"
                  onClick={() => excluirTarefa(tarefa.id, tarefa.nome)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn-add" onClick={abrirModalInclusao}>
        Incluir Nova Tarefa
      </button>

      <div className="footer-total">
        <strong>Custo Total: </strong>
        {formatarMoeda(
          tarefas.reduce((acc, t) => acc + Number(t.custo), 0)
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={fecharModal}
        onSave={salvarTarefa}
        task={currentTask}
      />
    </div>
  );
}

export default App;

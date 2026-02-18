import { useState, useEffect } from "react";
import "./TaskModal.css";

function TaskModal({ isOpen, onClose, onSave, task }) {
  const [formData, setFormData] = useState({
    nome: "",
    custo: "",
    data_limite: "",
  });

  useEffect(() => {
    if (task) {
      const dataFormatada = task.data_limite
        ? new Date(task.data_limite).toISOString().split("T")[0]
        : "";
      setFormData({
        nome: task.nome,
        custo: task.custo,
        data_limite: dataFormatada,
      });
    } else {
      setFormData({
        nome: "",
        custo: "",
        data_limite: "",
      });
    }
  }, [task, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{task ? "Editar Tarefa" : "Incluir Nova Tarefa"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome da Tarefa:</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Custo (R$):</label>
            <input
              type="number"
              name="custo"
              step="0.01"
              min="0"
              value={formData.custo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Data Limite:</label>
            <input
              type="date"
              name="data_limite"
              value={formData.data_limite}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;

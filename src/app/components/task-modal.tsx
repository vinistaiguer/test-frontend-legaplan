'use client'
import '@/app/style/task-manager.scss';
import React from 'react';

interface Task {
  text: string;
}

interface TaskModalProps {
  isOpen: boolean;
  closeModal: () => void;
  addTask?: () => void;
  deleteTask?: () => void;
  newTaskTitle?: string;
  setNewTaskTitle?: (title: string) => void;
  taskToDelete?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  closeModal,
  addTask,
  deleteTask,
  newTaskTitle,
  setNewTaskTitle,
  taskToDelete
}) => {
  if (!isOpen) return null;

  const handleAction = () => {
    if (addTask) {
      addTask();
    } else {
      deleteTask && deleteTask();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{addTask ? "Nova tarefa" : "Deletar tarefa"}</h2>
        <div className="modal-content">
          {addTask ? (
            <>
              <label htmlFor="new-task-title">Título</label>
              <input
                type="text"
                id="new-task-title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle?.(e.target.value)}
                placeholder="Digite o título da tarefa"
              />
            </>
          ) : (
            <p>Tem certeza que você deseja deletar a tarefa: {taskToDelete?.text}?</p>
          )}
        </div>
        <div className="modal-actions">
          <button onClick={closeModal} className="cancel-button">Cancelar</button>
          <button onClick={handleAction} className={addTask ? "add-button" : "delete-button"}>
            {addTask ? "Adicionar" : "Deletar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
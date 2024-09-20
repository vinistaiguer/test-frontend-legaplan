'use client';
import LogoSvg from "@/app/components/logo-svg";
import '@/app/style/task-manager.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  isNew: boolean;
  createdAt: Date;
}

interface Tooltip {
  visible: boolean;
  text: string;
  x: number;
  y: number;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip>({
    visible: false,
    text: '',
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get('http://localhost:3001/api/tasks');
      setTasks(response.data);
    };
    fetchTasks();
  }, []);

  const toggleTask = async (id: number) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );

    setTasks(updatedTasks);

    // Atualiza o backend
    const taskToUpdate = updatedTasks.find(task => task.id === id);
    if (taskToUpdate) {
      await axios.put(`http://localhost:3001/api/tasks/${id}`, taskToUpdate);
    }
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewTaskTitle('');
  };

  const addTask = async () => {
    if (newTaskTitle.trim() !== '') {
      const newTask = { 
        id: tasks.length + 1, 
        text: newTaskTitle.trim(), 
        completed: false,
        isNew: true,
        createdAt: new Date().toISOString()
      };
      const response = await axios.post('http://localhost:3001/api/tasks', newTask);
      setTasks([...tasks, response.data]);
      closeAddModal();
    }
  };

  const openDeleteModal = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const deleteTask = async () => {
    try {
      if (taskToDelete) {
        await axios.delete(`http://localhost:3001/api/tasks/${taskToDelete.id}`);
        setTasks(tasks.filter(task => task.id !== taskToDelete.id));
        closeDeleteModal();
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="task-manager">
      <header>
        <LogoSvg className="logo" />
        <h1>Bem-vindo de volta, Marcus</h1>
        <div className="date">
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}
        </div>
      </header>
      <main>
        <section>
          <h2>Suas tarefas de hoje</h2>
          {tasks.filter(task => !task.completed).map(task => (
            <div 
              key={task.id} 
              className="task"
              onMouseEnter={() => {
                const tooltipText = `Criada em: ${new Date(task.createdAt).toLocaleString()}`;
                setTooltip({ visible: true, text: tooltipText, x: 0, y: 0 });
              }}
              onMouseMove={(e) => {
                const tooltipX = e.clientX + 10;
                const tooltipY = e.clientY + 10;
                setTooltip(prevTooltip => ({ ...prevTooltip, x: tooltipX, y: tooltipY }));
              }}
              onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
            >
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleTask(task.id)} 
                id={`task-${task.id}`}
              />
              <label htmlFor={`task-${task.id}`}>{task.text}</label>
              {task.isNew && <span className="new-tag">NOVO!</span>}
              <button 
                onClick={() => openDeleteModal(task)}
                className="delete-task"
                aria-label={`Excluir tarefa: ${task.text}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          ))}
        </section>
        <section>
          <h2>Tarefas finalizadas</h2>
          {tasks.filter(task => task.completed).map(task => (
            <div key={task.id} className="task completed">
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleTask(task.id)} 
                id={`task-${task.id}`}
              />
              <label htmlFor={`task-${task.id}`}>{task.text}</label>
              <button 
                onClick={() => openDeleteModal(task)}
                className="delete-task"
                aria-label={`Excluir tarefa: ${task.text}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          ))}
        </section>
        <button onClick={openAddModal} className="add-task">Adicionar nova tarefa</button>
      </main>

      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Nova tarefa</h2>
            <div className="modal-content">
              <label htmlFor="new-task-title">Título</label>
              <input
                type="text"
                id="new-task-title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Digite o título da tarefa"
              />
            </div>
            <div className="modal-actions">
              <button onClick={closeAddModal} className="cancel-button">Cancelar</button>
              <button onClick={addTask} className="add-button">Adicionar</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && taskToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Deletar tarefa</h2>
            <div className="modal-content">
              <p>Tem certeza que você deseja deletar a tarefa: {taskToDelete.text}?</p>
            </div>
            <div className="modal-actions">
              <button onClick={closeDeleteModal} className="cancel-button">Cancelar</button>
              <button onClick={deleteTask} className="delete-button">Deletar</button>
            </div>
          </div>
        </div>
      )}

      {tooltip.visible && (
        <div className="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
'use client';
import LogoSvg from "@/app/components/logo-svg";
import '@/app/style/task-manager.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Task {
  id: string;
  text: string;
  completed?: boolean;
  isNew: boolean;
  createdAt: string;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');
        const fetchedTasks = Array.isArray(response.data) ? response.data : [];
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      }
    };
    fetchTasks();
  }, []);

  const toggleTask = async (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    const taskToUpdate = updatedTasks.find(task => task.id === id);
    if (taskToUpdate) {
      await axios.put(`/api/tasks`, taskToUpdate);
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
      const newTask: Task = { 
        id: uuidv4(),
        text: newTaskTitle.trim(), 
        completed: false,
        isNew: true,
        createdAt: new Date().toISOString()
      };
      const response = await axios.post('/api/tasks', newTask);
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
        await axios.delete(`/api/tasks?id=${taskToDelete.id}`);
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
        <section className="section-task-today">
          <h2 className="title-section-today">Suas tarefas de hoje</h2>
          {tasks.filter(task => !task.completed).map(task => (
            <div className={`task ${task.completed ? 'completed' : ''}`} key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                id={`task-${task.id}`}
              />
              <label htmlFor={`task-${task.id}`} className="task-text">{task.text}</label>
              <button
                onClick={() => openDeleteModal(task)}
                className="delete-task"
                aria-label={`Excluir tarefa: ${task.text}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M1 5H3M3 5H19M3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V5H3ZM6 5V3C6 2.46957 6.21071 1.96086 6.58579 1.58579C6.96086 1.21071 7.46957 1 8 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V5" stroke="#B0BBD1" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </section>
        <section className="section-task-completed">
          <h2 className="title-section-completed">Tarefas finalizadas</h2>
          {tasks.filter(task => task.completed).map(task => (
            <div key={task.id} className="task completed">
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleTask(task.id)} 
                id={`task-${task.id}`}
              />
              <label className="task-text" htmlFor={`task-${task.id}`}>{task.text}</label>
              <button 
                onClick={() => openDeleteModal(task)}
                className="delete-task"
                aria-label={`Excluir tarefa: ${task.text}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M1 5H3M3 5H19M3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V5H3ZM6 5V3C6 2.46957 6.21071 1.96086 6.58579 1.58579C6.96086 1.21071 7.46957 1 8 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V5" stroke="#B0BBD1" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </section>
      </main>
      <div className="add-task-container">
        <button onClick={openAddModal} className="add-task">Adicionar nova tarefa</button>
      </div>

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
                placeholder="Digite"
              />
            </div>
            <div className="modal-actions">
              <button onClick={addTask} className="add-button">Adicionar</button>
              <button onClick={closeAddModal} className="cancel-button">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && taskToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Excluir tarefa</h2>
            <p>Tem certeza que deseja excluir a tarefa "{taskToDelete.text}"?</p>
            <div className="modal-actions">
              <button onClick={deleteTask} className="delete-button">Excluir</button>
              <button onClick={closeDeleteModal} className="cancel-button">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
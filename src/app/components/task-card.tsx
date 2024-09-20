import '@/app/style/task-manager.scss';
import React from 'react';

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

interface TaskProps {
    task: {
      id: number;
      text: string;
      completed: boolean;
      isNew: boolean;
      createdAt: Date;
    };
    toggleTask: (id: number) => void;
    openDeleteModal: (task: any) => void;
    setTooltip: React.Dispatch<React.SetStateAction<Tooltip>>;
    completed?: boolean;
  }

const TaskCard: React.FC<TaskProps> = ({ task, toggleTask, openDeleteModal, setTooltip, completed }) => {
    return (
        <div 
          className={`task ${completed ? 'completed' : ''}`}
          onMouseEnter={() => {
            const tooltipText = `Criada em: ${task.createdAt.toLocaleString()}`;
            setTooltip({ visible: true, text: tooltipText, x: 0, y: 0 });
          }}
          onMouseLeave={() => setTooltip((prev: Tooltip) => ({ ...prev, visible: false }))}
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
  );
};

export default TaskCard;
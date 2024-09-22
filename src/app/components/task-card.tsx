'use client'
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
  task: Task;
  toggleTask: (id: number) => void;
  openDeleteModal: (task: Task) => void;
  completed?: boolean;
}

const TaskCard: React.FC<TaskProps> = ({ task, toggleTask, openDeleteModal, completed }) => {

  return (
    <div className={`task ${completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTask(task.id)}
        id={`task-${task.id}`}
      />
      <label htmlFor={`task-${task.id}`} className="task-text">{task.text}</label>
      {/* {task.isNew && <span className="new-tag">NOVO!</span>} */}
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
  );
};

export default TaskCard;
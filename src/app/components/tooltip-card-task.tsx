'use client'
import '@/app/style/task-manager.scss';
import React from 'react';

interface Tooltip {
  visible: boolean;
  text: string;
  x: number;
  y: number;
}

interface TooltipProps {
  tooltip: Tooltip;
}

const TooltipCardTask: React.FC<TooltipProps> = ({ tooltip }) => {
  const { visible, text, x, y } = tooltip;

  if (!visible) return null;

  return (
    <div
      style={{
        left: x + 'px',
        top: y + 'px',
        position: 'fixed',
        backgroundColor: '#F4F4F4',
        boxShadow: '1px 1px 5px #0000008A',
        color: '#000',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 1000,
        whiteSpace: 'nowrap',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out',
      }}
    >
      {text}
    </div>
  );
};

export default TooltipCardTask;
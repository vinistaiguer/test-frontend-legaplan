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
    <div className="tooltip" style={{ left: x, top: y }}>
      {text}
    </div>
  );
};

export default TooltipCardTask;
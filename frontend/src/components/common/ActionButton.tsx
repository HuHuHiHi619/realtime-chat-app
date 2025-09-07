import React from "react";

interface ActionButtonProps {
  icon: React.ElementType;
  text: string;
  className?: string;       // สำหรับปุ่ม
  iconClassName?: string;   // สำหรับ icon
  textClassName?: string;   // สำหรับ text
  action : () => void
}

function ActionButton({ 
  icon: Icon, 
  text, 
  className = "", 
  iconClassName = "w-5 h-5", 
  textClassName = "", 
  action
}: ActionButtonProps) {
  return (
    <button
      onClick={action}
      className={`flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${className}`}
    >
      <Icon className={iconClassName} />
      <span className={textClassName}>{text}</span>
    </button>
  );
}

export default ActionButton;

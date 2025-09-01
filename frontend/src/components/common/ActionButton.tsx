import React from "react";

interface ActionButtonProps {
    icon: string;
    text: string;
}

function ActionButton({ icon, text } : ActionButtonProps) {
  return (
    <button className="flex justify-center gap-2 p-1 cursor-pointer rounded-lg hover:bg-pink-500">
        <span className="text-black">{icon}</span>
        <span className="text-black">{text}</span>
    </button>
  );
}

export default ActionButton;

import React from "react";
import { Plus } from "lucide-react";

const ModalButton = ({
  onClick,
  icon: Icon = Plus,
  label,
  size = "md",
  className = "",
}) => {
  const sizeStyles = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 ${sizeStyles[size]} bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold shadow-md hover:scale-105 transform ${className}`}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      <span>{label}</span>
    </button>
  );
};

export default ModalButton;

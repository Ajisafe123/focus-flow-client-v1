import React from "react";
import { Plus, ArrowUpRight } from "lucide-react";

const ActionButton = ({
  onClick,
  icon: Icon = Plus,
  label,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}) => {
  const baseStyles = "flex items-center gap-2 font-semibold transition-all duration-200 rounded-lg";
  
  const sizeStyles = {
    sm: "px-3 py-2 text-xs sm:text-sm",
    md: "px-4 py-2.5 text-sm sm:text-base",
    lg: "px-6 py-3 text-base sm:text-lg",
  };

  const variantStyles = {
    primary: "bg-gradient-to-br from-emerald-500 to-green-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "border-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
    ghost: "text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      <span>{label}</span>
      <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

export default ActionButton;

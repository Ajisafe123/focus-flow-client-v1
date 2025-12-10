import React from "react";

const LoadingSpinner = ({ size = "medium", message = "Loading..." }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} loader`} />
      {message && <p className="text-gray-600 font-medium">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;

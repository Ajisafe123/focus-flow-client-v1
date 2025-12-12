import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="loader"></div>
      {message && (
        <p className="text-sm text-gray-600 font-medium">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;

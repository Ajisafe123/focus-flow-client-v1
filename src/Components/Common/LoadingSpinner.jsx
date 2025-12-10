import React from "react";

const LoadingSpinner = ({ size = "medium", message = "Loading...", fullScreen = false, colorClass = "border-emerald-100 border-t-emerald-600" }) => {
    const sizeClasses = {
        small: "w-6 h-6 border-2",
        medium: "w-10 h-10 border-3",
        large: "w-16 h-16 border-4",
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className={`${sizeClasses[size]} ${colorClass} rounded-full animate-spin transition-all`} />
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center w-full">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;

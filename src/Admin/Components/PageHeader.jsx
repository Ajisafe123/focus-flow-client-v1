import React from "react";

const PageHeader = ({ 
  title, 
  subtitle, 
  children,
  className = ""
}) => {
  return (
    <div className={`bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      <div className="relative flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            {title}
          </h1>
          {subtitle && (
            <p className="text-emerald-50 text-sm sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-2 flex-wrap">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;

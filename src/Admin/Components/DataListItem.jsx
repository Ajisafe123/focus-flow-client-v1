import React from "react";

const DataListItem = ({
  title,
  subtitle,
  description,
  metadata = [],
  actions = [],
  icon: Icon,
  className = "",
}) => {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100 ${className}`}>
      {Icon && (
        <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-sm flex-shrink-0">
          <Icon className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {subtitle && (
          <p className="text-sm text-gray-600 truncate">{subtitle}</p>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{description}</p>
        )}
        {metadata.length > 0 && (
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {metadata.map((item, idx) => (
              <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {actions.length > 0 && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className={`p-2 rounded-lg transition-all ${action.className || "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
              title={action.title}
            >
              <action.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataListItem;

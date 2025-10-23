import React from "react";
import { Key, Shield, Trash2 } from "lucide-react";

const ToggleSwitch = ({
  enabled,
  onToggle,
  IconOn,
  IconOff,
  title,
  description,
}) => (
  <div className="flex items-center justify-between p-5 hover:bg-emerald-50 transition-all duration-200 rounded-xl border border-transparent hover:border-emerald-100">
    <div className="flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
          enabled
            ? "bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg shadow-emerald-200"
            : "bg-gray-100"
        }`}
      >
        {enabled ? (
          <IconOn className="w-6 h-6 text-white" />
        ) : (
          <IconOff className="w-6 h-6 text-gray-400" />
        )}
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-base">{title}</p>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
    <button
      onClick={onToggle}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 shadow-inner ${
        enabled
          ? "bg-gradient-to-r from-emerald-600 to-teal-600"
          : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
          enabled ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

const SectionHeader = ({ title, Icon }) => (
  <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-emerald-50 to-white border-b-2 border-emerald-100">
    <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
  </div>
);

export default function Security({ settings, handleToggle, handleClearData }) {
  return (
    <div className="divide-y-2 divide-gray-50">
      <SectionHeader title="Authentication" Icon={Key} />
      <ToggleSwitch
        enabled={settings.twoFactorEnabled}
        onToggle={() => handleToggle("twoFactorEnabled")}
        IconOn={Shield}
        IconOff={Shield}
        title="Two-Factor Authentication"
        description="Add extra account security"
      />

      <SectionHeader title="Account Actions" Icon={Trash2} />
      <div className="p-5">
        <button
          onClick={handleClearData}
          className="w-full flex items-center gap-4 p-5 hover:bg-red-50 transition-all duration-200 rounded-2xl text-left border-2 border-transparent hover:border-red-200"
        >
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="font-bold text-red-600 text-base">
              Clear All Settings
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              Remove all saved preferences and reset
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

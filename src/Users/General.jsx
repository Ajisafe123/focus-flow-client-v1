import React from "react";
import {
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Globe,
  Clock,
  Shield,
  Vibrate,
  Gauge,
} from "lucide-react";

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

const Selector = ({ value, onChange, options, title, description, Icon }) => (
  <div className="px-5 py-5 hover:bg-emerald-50 transition-all duration-200 rounded-xl">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-200">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900 mb-1 text-base">{title}</p>
        <p className="text-sm text-gray-500 mb-3">{description}</p>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-gray-900 transition-all duration-200 cursor-pointer hover:border-emerald-300"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
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

export default function General({
  settings,
  handleToggle,
  handleSelectChange,
}) {
  const calculationOptions = [
    { value: "mwl", label: "Muslim World League" },
    { value: "isna", label: "Islamic Society of North America" },
    { value: "egypt", label: "Egyptian General Authority" },
    { value: "makkah", label: "Umm Al-Qura University, Makkah" },
  ];

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "ar", label: "Arabic" },
    { value: "ur", label: "Urdu" },
  ];

  const timeFormatOptions = [
    { value: "12h", label: "12-Hour (AM/PM)" },
    { value: "24h", label: "24-Hour (Military)" },
  ];

  return (
    <div className="divide-y-2 divide-gray-50">
      <SectionHeader title="System Preferences" Icon={Gauge} />
      <ToggleSwitch
        enabled={settings.hapticsEnabled}
        onToggle={() => handleToggle("hapticsEnabled")}
        IconOn={Vibrate}
        IconOff={Vibrate}
        title="Haptic Feedback"
        description="Enable vibration and touch feedback"
      />
      <Selector
        value={settings.timeFormat}
        onChange={(val) => handleSelectChange("timeFormat", val)}
        options={timeFormatOptions}
        title="Time Format"
        description="Choose between 12h or 24h clock"
        Icon={Clock}
      />

      <SectionHeader title="Notification & Sound" Icon={Bell} />
      <ToggleSwitch
        enabled={settings.soundEnabled}
        onToggle={() => handleToggle("soundEnabled")}
        IconOn={Volume2}
        IconOff={VolumeX}
        title="Azan Sound"
        description="Play Azan at prayer time"
      />
      <ToggleSwitch
        enabled={settings.notificationsEnabled}
        onToggle={() => handleToggle("notificationsEnabled")}
        IconOn={Bell}
        IconOff={BellOff}
        title="Push Notifications"
        description="Receive prayer reminders"
      />

      <SectionHeader title="Prayer & Location" Icon={Globe} />
      <Selector
        value={settings.calculationMethod}
        onChange={(val) => handleSelectChange("calculationMethod", val)}
        options={calculationOptions}
        title="Calculation Method"
        description="Select your preferred calculation method"
        Icon={Shield}
      />
      <ToggleSwitch
        enabled={settings.autoLocation}
        onToggle={() => handleToggle("autoLocation")}
        IconOn={Globe}
        IconOff={Globe}
        title="Auto Location"
        description="Detect your location automatically"
      />

      <SectionHeader title="Language" Icon={Globe} />
      <Selector
        value={settings.language}
        onChange={(val) => handleSelectChange("language", val)}
        options={languageOptions}
        title="App Language"
        description="Select interface language"
        Icon={Globe}
      />
    </div>
  );
}

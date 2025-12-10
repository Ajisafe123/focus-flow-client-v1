import React, { useState } from "react";
import {
  Save,
  Bell,
  Globe,
  Palette,
  Languages,
  AlertCircle,
  Moon,
  Sun,
  Monitor,
  Check,
  Settings as SettingsIcon, // Renamed the imported icon
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    comments: true,
    newUsers: false,
  });

  const [siteSettings, setSiteSettings] = useState({
    siteName: "Nibras Al-Deen",
    tagline: "Guiding Light of Faith",
    language: "en",
    timezone: "Africa/Lagos",
    maintenanceMode: false,
  });

  const [socialLinks, setSocialLinks] = useState({
    facebook: "https://facebook.com/nibrasaldeen",
    twitter: "https://twitter.com/nibrasaldeen",
    instagram: "https://instagram.com/nibrasaldeen",
    youtube: "https://youtube.com/nibrasaldeen",
  });

  return (
    <div className="space-y-4 sm:space-y-6 max-w-10xl mx-auto">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
            Settings
          </h1>
          <p className="text-emerald-50 text-sm sm:text-base md:text-lg">
            Configure your site preferences and options
          </p>
        </div>
      </div>

      {/* Site Settings */}
      <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Site Configuration
            </h3>
            <p className="text-sm text-gray-600">
              Manage your site's basic information
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={siteSettings.siteName}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    siteName: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={siteSettings.tagline}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    tagline: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <div className="relative">
                <Languages className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <select
                  value={siteSettings.language}
                  onChange={(e) =>
                    setSiteSettings({
                      ...siteSettings,
                      language: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none transition-all"
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic (العربية)</option>
                  <option value="fr">French (Français)</option>
                  <option value="ur">Urdu (اردو)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <select
                  value={siteSettings.timezone}
                  onChange={(e) =>
                    setSiteSettings({
                      ...siteSettings,
                      timezone: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none transition-all"
                >
                  <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                  <option value="Africa/Cairo">Africa/Cairo (GMT+2)</option>
                  <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                  <option value="Europe/London">Europe/London (GMT+0)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Appearance</h3>
            <p className="text-sm text-gray-600">
              Customize the look and feel of your dashboard
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Theme Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button className="flex flex-col items-center gap-2 p-3 sm:p-4 border-2 border-emerald-500 bg-emerald-50 rounded-lg transition-all hover:shadow-md">
                <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                  Light
                </span>
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
              </button>

              <button className="flex flex-col items-center gap-2 p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all">
                <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                  Dark
                </span>
              </button>

              <button className="flex flex-col items-center gap-2 p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all">
                <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                  System
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">
                  Primary Color Scheme
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Emerald & Green Gradient
                </p>
              </div>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-md"></div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-600">
              Control how you receive notifications
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries({
            email: {
              label: "Email Notifications",
              desc: "Receive notifications via email",
            },
            push: {
              label: "Push Notifications",
              desc: "Receive browser push notifications",
            },
            comments: {
              label: "New Comments",
              desc: "Get notified when users comment",
            },
            newUsers: {
              label: "New User Registrations",
              desc: "Alert when new users sign up",
            },
          }).map(([key, { label, desc }]) => (
            <div
              key={key}
              className="flex items-center justify-between gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold text-gray-900 block text-sm sm:text-base">
                    {label}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600 block">
                    {desc}
                  </span>
                </div>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    [key]: !notifications[key],
                  })
                }
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                  notifications[key]
                    ? "bg-gradient-to-br from-emerald-500 to-green-600"
                    : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute w-5 h-5 bg-white rounded-full top-0.5 shadow-md transition-transform ${
                    notifications[key] ? "translate-x-5" : "translate-x-0.5"
                  }`}
                ></div>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Social Media Links
            </h3>
            <p className="text-sm text-gray-600">
              Connect your social media profiles
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              icon: Facebook,
              key: "facebook",
              label: "Facebook Page",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              icon: Twitter,
              key: "twitter",
              label: "Twitter Profile",
              color: "text-sky-600",
              bg: "bg-sky-50",
            },
            {
              icon: Instagram,
              key: "instagram",
              label: "Instagram Account",
              color: "text-pink-600",
              bg: "bg-pink-50",
            },
            {
              icon: Youtube,
              key: "youtube",
              label: "YouTube Channel",
              color: "text-red-600",
              bg: "bg-red-50",
            },
          ].map(({ icon: Icon, key, label, color, bg }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <div className="relative">
                <div
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <input
                  type="url"
                  value={socialLinks[key]}
                  onChange={(e) =>
                    setSocialLinks({
                      ...socialLinks,
                      [key]: e.target.value,
                    })
                  }
                  placeholder={`https://${key}.com/nibrasaldeen`}
                  className="w-full pl-14 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-2.5 bg-yellow-100 rounded-lg flex-shrink-0">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Maintenance Mode
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Enable maintenance mode to show a temporary "under maintenance"
              page to all visitors while you work on the site. Only
              administrators will be able to access the dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={() =>
                  setSiteSettings({
                    ...siteSettings,
                    maintenanceMode: !siteSettings.maintenanceMode,
                  })
                }
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all font-semibold shadow-sm hover:shadow-md text-sm sm:text-base w-full sm:w-auto ${
                  siteSettings.maintenanceMode
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-emerald-500 text-white hover:bg-emerald-600"
                }`}
              >
                {siteSettings.maintenanceMode
                  ? "Disable Maintenance"
                  : "Enable Maintenance"}
              </button>
              {siteSettings.maintenanceMode && (
                <span className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-100 text-red-700 rounded-lg text-xs sm:text-sm font-semibold">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Currently Active
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-gray-600">
            Make sure to save your changes before leaving this page
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold text-sm sm:text-base">
              Reset to Defaults
            </button>
            <button className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-md transition-all font-semibold shadow-sm text-sm sm:text-base">
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              Save All Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

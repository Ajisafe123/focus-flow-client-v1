import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Camera,
  Save,
  Edit2,
  Globe2,
  Building2,
  Settings,
  LogOut,
} from "lucide-react";
import LogoutModal from "../../Components/Authentications/LogoutModal";
import LoadingSpinner from "../../Common/LoadingSpinner";
import apiService, {
  API_BASE_URL,
  logout as apiLogout,
  fetchProfileMe,
  updateProfile as updateProfileApi,
  updateProfileLocation,
} from "../Service/apiService";

export default function ProfilePage({
  setShowLogoutModal: propSetShowLogoutModal,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    city: "",
    region: "",
    country: "",
    joinedDate: "",
    bio: "",
    avatar: null,
    latitude: null,
    longitude: null,
  });
  const [tempData, setTempData] = useState({});
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in.");
        return;
      }

      const data = await fetchProfileMe(token);

      setProfileData({
        username: data.username || "",
        email: data.email || "",
        city: data.city || "",
        region: data.region || "",
        country: data.country || "",
        joinedDate: data.created_at
          ? new Date(data.created_at).toLocaleDateString()
          : new Date().toLocaleDateString(),
        bio: data.bio || "As-salamu alaykum! May Allah bless you.",
        avatar: data.avatar_url ? `${API_BASE_URL}${data.avatar_url}` : null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      });

      setTempData({
        username: data.username || "",
        email: data.email || "",
        city: data.city || "",
        region: data.region || "",
        country: data.country || "",
        bio: data.bio || "",
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile. Please check your server connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setTempData((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));

          const token = localStorage.getItem("token");
          if (token) {
            updateProfileLocation({ latitude, longitude }, token).catch((err) =>
              console.warn("Failed to persist profile location", err)
            );
          }
        },
        (error) => {
          console.warn("Location access denied:", error);
        }
      );
    }
  }, [fetchProfile]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(profileData);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        return;
      }

      const formData = new FormData();
      formData.append("bio", tempData.bio || "");
      formData.append("username", tempData.username || "");
      formData.append("city", tempData.city || "");
      formData.append("region", tempData.region || "");
      formData.append("country", tempData.country || "");
      formData.append("latitude", tempData.latitude || 0);
      formData.append("longitude", tempData.longitude || 0);
      if (selectedAvatar) formData.append("avatar", selectedAvatar);

      await updateProfileApi(formData, token);
      await fetchProfile();
      setIsEditing(false);
      setSelectedAvatar(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Error updating profile. Try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData(profileData);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSettings = () => {
    window.location.href = "/settings";
  };

  const handleLogout = () => {
    if (propSetShowLogoutModal) {
      propSetShowLogoutModal(true);
    } else {
      setShowLogoutModal(true);
    }
  };

  const handleConfirmedLogout = () => {
    apiLogout();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-2 sm:p-4 md:p-6">
      <div className="transform scale-[0.85] sm:scale-90 md:scale-95 origin-top mx-auto max-w-6xl">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <div className="mb-8 backdrop-blur-sm bg-white/60 rounded-3xl p-6 border border-white/40 shadow-lg flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Profile
            </h1>
            <p className="text-slate-600">Manage your account information</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSettings}
              className="w-12 h-12 bg-white hover:bg-emerald-50 rounded-2xl flex items-center justify-center transition-all shadow-md hover:shadow-lg border border-emerald-100"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-emerald-600" />
            </button>
            <button
              onClick={handleLogout}
              className="w-12 h-12 bg-white hover:bg-red-50 rounded-2xl flex items-center justify-center transition-all shadow-md hover:shadow-lg border border-red-100"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <>
            <div className="backdrop-blur-xl bg-white/80 rounded-3xl border border-white/40 overflow-hidden mb-8 shadow-2xl">
              <div className="h-48 bg-gradient-to-br from-emerald-600 via-teal-500 to-emerald-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              </div>

              <div className="px-8 pb-8 pt-5">
                <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6 -mt-20">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl border-8 border-white bg-white overflow-hidden shadow-2xl transform transition-transform group-hover:scale-105">
                      {profileData.avatar ? (
                        <img
                          src={profileData.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 flex items-center justify-center">
                          <User className="w-16 h-16 text-white" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center cursor-pointer hover:from-emerald-700 hover:to-teal-700 transition-all shadow-xl transform hover:scale-110">
                      <Camera className="w-5 h-5 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex-1 text-center lg:text-left mb-4 lg:mb-0">
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">
                      {profileData.username}
                    </h2>
                    <p className="text-slate-600 text-base">
                      {profileData.email}
                    </p>
                  </div>

                  <button
                    onClick={isEditing ? handleCancel : handleEdit}
                    className="px-6 py-3 bg-gradient-to-r from-white to-emerald-50 border-2 border-emerald-200 hover:border-emerald-300 rounded-2xl transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                  >
                    <Edit2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-1 font-medium">
                      Username
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempData.username}
                        onChange={(e) =>
                          setTempData({ ...tempData, username: e.target.value })
                        }
                        className="border-2 border-emerald-200 rounded-xl px-3 py-2 w-full focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all bg-white/80 text-sm font-medium"
                      />
                    ) : (
                      <p className="font-bold text-slate-800 text-base">
                        {profileData.username}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-1 font-medium">
                      Email
                    </p>
                    <p className="font-bold text-slate-800 text-base break-all">
                      {profileData.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1 font-medium">
                        City
                      </p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempData.city}
                          onChange={(e) =>
                            setTempData({ ...tempData, city: e.target.value })
                          }
                          className="border-2 border-purple-200 rounded-xl px-3 py-2 w-full focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all bg-white/80 text-sm font-medium"
                        />
                      ) : (
                        <p className="font-bold text-slate-800 text-base">
                          {profileData.city || "Not set"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1 font-medium">
                        Region / State
                      </p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempData.region}
                          onChange={(e) =>
                            setTempData({ ...tempData, region: e.target.value })
                          }
                          className="border-2 border-rose-200 rounded-xl px-3 py-2 w-full focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all bg-white/80 text-sm font-medium"
                        />
                      ) : (
                        <p className="font-bold text-slate-800 text-base">
                          {profileData.region || "Not set"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <Globe2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1 font-medium">
                        Country
                      </p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempData.country}
                          onChange={(e) =>
                            setTempData({
                              ...tempData,
                              country: e.target.value,
                            })
                          }
                          className="border-2 border-amber-200 rounded-xl px-3 py-2 w-full focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all bg-white/80 text-sm font-medium"
                        />
                      ) : (
                        <p className="font-bold text-slate-800 text-base">
                          {profileData.country || "Not set"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-1 font-medium">
                      Joined
                    </p>
                    <p className="font-bold text-slate-800 text-base">
                      {profileData.joinedDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full"></div>
                About Me
              </h3>
              {isEditing ? (
                <textarea
                  value={tempData.bio}
                  onChange={(e) =>
                    setTempData({ ...tempData, bio: e.target.value })
                  }
                  className="w-full border-2 border-emerald-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 min-h-32 transition-all bg-white/80 text-sm resize-none"
                />
              ) : (
                <p className="text-slate-700 leading-relaxed text-base">
                  {profileData.bio}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm sm:text-base"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <LogoutModal
        isOpen={propSetShowLogoutModal ? false : showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmedLogout}
      />
    </div>
  );
}

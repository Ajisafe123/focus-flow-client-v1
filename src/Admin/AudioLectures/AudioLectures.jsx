import React, { useState, useEffect, useCallback } from "react";
import {
  Music,
  Plus,
  Edit,
  Trash2,
  Headphones,
  FileText,
  Clock,
  Speaker,
  CheckCircle,
  Tag,
  Search,
  ArrowUpRight,
  Eye,
} from "lucide-react";
import AudioModal from "./AudioModal";
import DeleteModal from "../DeleteModal";
import { API_BASE_URL } from "../../Components/Service/apiService";

const audioCategories = ["Qira'at", "Tafsir Audios", "Khutbah", "Du'a & Adhkar"];

const emptyAudioFormData = {
  title: "",
  category: "",
  speaker: "",
  duration: "",
  audioUrl: "",
  description: "",
  thumbnail: "",
  featured: false,
  status: "draft",
};

const AudioLectures = () => {
  const [lectures, setLectures] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState(null);
  const [formData, setFormData] = useState(emptyAudioFormData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLectures = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/audio`);
      if (!res.ok) throw new Error("Failed to fetch audio");
      const data = await res.json();
      setLectures(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenAddModal = () => {
    setFormData(emptyAudioFormData);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lecture) => {
    setFormData({
      id: lecture.id || lecture._id,
      title: lecture.title || "",
      category: lecture.category || "",
      speaker: lecture.speaker || "",
      duration: lecture.duration || "",
      audioUrl: lecture.url || lecture.audioUrl || "",
      description: lecture.description || "",
      thumbnail: lecture.cover_image || lecture.thumbnail || "",
      featured: !!lecture.featured,
      status: lecture.status || "published",
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteLecture = async () => {
    if (!lectureToDelete) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/audio/${lectureToDelete.id || lectureToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete audio");
      await fetchLectures();
      setIsDeleteModalOpen(false);
      setLectureToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddLecture = async () => {
    if (!formData.title || !formData.audioUrl) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/audio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          title: formData.title,
          url: formData.audioUrl,
          description: formData.description,
          cover_image: formData.thumbnail,
          duration: formData.duration,
          category: formData.category,
          speaker: formData.speaker,
          featured: formData.featured,
          status: formData.status || "published",
        }),
      });
      if (!res.ok) throw new Error("Failed to add audio");
      await fetchLectures();
      setFormData(emptyAudioFormData);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateLecture = async () => {
    if (!formData.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/audio/${formData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          title: formData.title,
          url: formData.audioUrl,
          description: formData.description,
          cover_image: formData.thumbnail,
          duration: formData.duration,
          category: formData.category,
          speaker: formData.speaker,
          featured: formData.featured,
          status: formData.status || "published",
        }),
      });
      if (!res.ok) throw new Error("Failed to update audio");
      await fetchLectures();
      setFormData(emptyAudioFormData);
      setIsModalOpen(false);
      setIsEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredLectures = lectures.filter((lecture) => {
    const status = (lecture.status || "published").toLowerCase();
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "published" && status === "published") ||
      (activeTab === "drafts" && status === "draft");
    const title = (lecture.title || "").toLowerCase();
    const speaker = (lecture.speaker || "").toLowerCase();
    const matchesSearch =
      title.includes(searchQuery.toLowerCase()) ||
      speaker.includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalLectures = lectures.length;
  const publishedCount = lectures.filter(
    (l) => (l.status || "published") === "published"
  ).length;
  const draftsCount = lectures.filter(
    (l) => (l.status || "draft") === "draft"
  ).length;
  const totalDownloads = lectures.reduce((sum, l) => sum + (l.downloads || 0), 0);

  const stats = [
    { icon: Headphones, title: "Total Audios", value: totalLectures },
    { icon: CheckCircle, title: "Published", value: publishedCount },
    { icon: FileText, title: "Drafts", value: draftsCount },
    {
      icon: Speaker,
      title: "Total Downloads",
      value: `${(totalDownloads / 1000).toFixed(1)}k`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-10xl mx-auto space-y-4 sm:space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}
        {loading && (
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            Loading audio...
          </div>
        )}
        <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
                <Music className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" />
                Audio Lectures Management
              </h1>
              <p className="text-emerald-50 text-xs sm:text-sm md:text-base">
                Create and manage Islamic knowledge Audio lectures
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Lecture
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Audio Library
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search audio lectures..."
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  { id: "all", label: "All", count: lectures.length },
                  {
                    id: "published",
                    label: "Published",
                    count: publishedCount,
                  },
                  { id: "drafts", label: "Drafts", count: draftsCount },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 font-semibold transition-all duration-200 whitespace-nowrap rounded-lg text-sm ${
                      activeTab === tab.id
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        activeTab === tab.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredLectures.map((lecture) => (
                <div
                  key={lecture.id}
                  className="p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                      <Headphones className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                            {lecture.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {lecture.speaker}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleOpenEditModal(lecture)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setLectureToDelete(lecture);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {lecture.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {lecture.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Speaker className="w-3 h-3" /> Downloads:{" "}
                          {lecture.downloads.toLocaleString()}
                        </span>
                        {lecture.status === "published" ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold">
                            Draft
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleOpenAddModal}
                  className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-md transition-all duration-200 group"
                >
                  <div className="p-1.5 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm">Add New Lecture</span>
                  <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => setActiveTab("drafts")}
                  className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-md transition-all duration-200 group"
                >
                  <div className="p-1.5 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                    <Edit className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm">
                    Review Drafts ({draftsCount})
                  </span>
                  <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => setActiveTab("published")}
                  className="w-full flex items-center gap-3 p-3.5 border-2 border-emerald-100 bg-emerald-50 text-emerald-700 rounded-lg hover:border-emerald-200 hover:bg-emerald-100 transition-all duration-200 group"
                >
                  <div className="p-1.5 bg-emerald-100 rounded-md group-hover:bg-emerald-200 transition-colors">
                    <Eye className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm">
                    Preview Published
                  </span>
                  <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AudioModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        handleChange={handleChange}
        handleAddLecture={handleAddLecture}
        handleUpdateLecture={handleUpdateLecture}
        categories={audioCategories}
        isEditMode={isEditMode}
      />

      <DeleteModal
        show={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteLecture}
        itemTitle={lectureToDelete?.title || ""}
        itemType="Audio Lecture"
        warningText="Deleting this audio will permanently remove it from the system and user download list."
      />
    </div>
  );
};

export default AudioLectures;
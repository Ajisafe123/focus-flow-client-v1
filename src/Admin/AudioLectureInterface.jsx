import React, { useState } from "react";
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
import DeleteConfirmModal from "./DeleteConfirmModal";

const audioCategories = [
  "Qira'at",
  "Tafsir Audios",
  "Khutbah",
  "Du'a & Adhkar",
];

const initialAudioLectures = [
  {
    id: 101,
    title: "The Melodies of the Quran: Recitation Styles",
    category: "Qira'at",
    speaker: "Qari Abdul Basit",
    status: "published",
    downloads: 12540,
    duration: "1:15:20",
    date: "2024-09-01",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    description:
      "An in-depth exploration of the various authentic styles of Quranic recitation (Qira'at).",
  },
  {
    id: 102,
    title: "Understanding Surah Yusuf (Part 1)",
    category: "Tafsir Audios",
    speaker: "Sheikh Yassir",
    status: "draft",
    downloads: 0,
    duration: "45:30",
    date: "2024-10-15",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    description: "First part of the detailed Tafsir of Surah Yusuf.",
  },
  {
    id: 103,
    title: "Jummah Khutbah: The Importance of Family",
    category: "Khutbah",
    speaker: "Imam Ali",
    status: "published",
    downloads: 8900,
    duration: "20:05",
    date: "2024-11-01",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    description: "A reminder of the essential role of family in Islam.",
  },
];

const emptyAudioFormData = {
  title: "",
  category: "",
  speaker: "",
  duration: "",
  audioUrl: "",
  description: "",
  thumbnail: "",
};

const AudioAdminDashboard = () => {
  const [lectures, setLectures] = useState(initialAudioLectures);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState(null);
  const [formData, setFormData] = useState(emptyAudioFormData);
  const [isEditMode, setIsEditMode] = useState(false);

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
    setFormData(lecture);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteLecture = () => {
    if (lectureToDelete) {
      setLectures(
        lectures.filter((lecture) => lecture.id !== lectureToDelete.id)
      );
      setIsDeleteModalOpen(false);
      setLectureToDelete(null);
    }
  };

  const handleAddLecture = () => {
    if (
      formData.title &&
      formData.category &&
      formData.speaker &&
      formData.duration &&
      formData.audioUrl
    ) {
      const lecture = {
        id:
          lectures.length > 0
            ? Math.max(...lectures.map((l) => l.id)) + 1
            : 101,
        ...formData,
        downloads: 0,
        date: new Date().toISOString().split("T")[0],
        status: "draft",
      };
      setLectures([...lectures, lecture]);
      setFormData(emptyAudioFormData);
      setIsModalOpen(false);
    } else {
      alert("Please fill out all required fields.");
    }
  };

  const handleUpdateLecture = () => {
    if (formData.id) {
      setLectures(
        lectures.map((l) => (l.id === formData.id ? { ...l, ...formData } : l))
      );
      setFormData(emptyAudioFormData);
      setIsModalOpen(false);
      setIsEditMode(false);
    }
  };

  const filteredLectures = lectures.filter((lecture) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "published" && lecture.status === "published") ||
      (activeTab === "drafts" && lecture.status === "draft");
    const matchesSearch =
      lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalLectures = lectures.length;
  const publishedCount = lectures.filter(
    (l) => l.status === "published"
  ).length;
  const draftsCount = lectures.filter((l) => l.status === "draft").length;
  const totalDownloads = lectures.reduce((sum, l) => sum + l.downloads, 0);

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
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <Music className="w-7 h-7 sm:w-9 sm:h-9" />
                Audio Lectures Management
              </h1>
              <p className="text-emerald-50 text-sm sm:text-base">
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      <DeleteConfirmModal
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

export default AudioAdminDashboard;
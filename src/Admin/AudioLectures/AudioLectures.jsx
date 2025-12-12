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
import CreateCategoryModal from "../CreateCategoryModal";
import LoadingSpinner from "../../Components/Common/LoadingSpinner";
import PageHeader from "../Components/PageHeader";
import ModalButton from "../Components/ModalButton";
import StatCardGrid from "../Components/StatCardGrid";
import CategoryDropdownCustom from "../Components/CategoryDropdownCustom";
import { API_BASE_URL } from "../../Components/Service/apiService";

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
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState(null);
  const [formData, setFormData] = useState(emptyAudioFormData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${apiBase}/api/audio-categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  }, []);

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
    fetchCategories();
  }, [fetchLectures, fetchCategories]);

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

  const statsData = [
    { icon: Headphones, title: "Total Audios", value: totalLectures.toString() },
    { icon: CheckCircle, title: "Published", value: publishedCount.toString() },
    { icon: FileText, title: "Drafts", value: draftsCount.toString() },
    {
      icon: Speaker,
      title: "Total Downloads",
      value: `${(totalDownloads / 1000).toFixed(1)}k`,
    },
  ];

  return (
    <div className="space-y-6 max-w-10xl mx-auto">
      {error && (
        <div className="p-6 rounded-2xl bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner message="Loading audio lectures..." />
        </div>
      )}
      {!loading && (
        <>
          <PageHeader
            title="Audio Lectures Management"
            subtitle="Create and manage Islamic knowledge audio lectures"
          >
            <ModalButton
              onClick={handleOpenAddModal}
              label="Add Lecture"
              size="md"
            />
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-semibold text-sm"
            >
              <Tag className="w-4 h-4" />
              Add Category
            </button>
          </PageHeader>

          <StatCardGrid stats={statsData} />

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Audio Library
            </h3>
            
            <div className="flex flex-col gap-3 mb-6">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search audio lectures..."
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <CategoryDropdownCustom
                categories={categories.map((cat) => ({
                  id: cat,
                  label: cat,
                }))}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                placeholder="Select Audio Category"
              />
            </div>

            {filteredLectures.length > 0 ? (
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
            ) : (
              <div className="text-center py-12 px-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  No lectures found
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Try adjusting your filters or create a new lecture
                </p>
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                >
                  Create Lecture
                </button>
              </div>
            )}
          </div>

        <AudioModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          formData={formData}
          handleChange={handleChange}
          handleAddLecture={handleAddLecture}
          handleUpdateLecture={handleUpdateLecture}
          categories={categories}
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

        <CreateCategoryModal
          show={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onSave={fetchCategories}
          categories={categories}
          fetchCategories={fetchCategories}
          categoryType="audio"
        />
        </>
      )}
    </div>
  );
};

export default AudioLectures;
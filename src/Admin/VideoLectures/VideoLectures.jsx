import React, { useEffect, useState, useCallback } from "react";
import {
  Video,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  TrendingUp,
  MessageSquare,
  Star,
  CheckCircle,
  Clock,
  Play,
  Tag,
  ArrowUpRight,
} from "lucide-react";
import AdminVideoLectureModal from "./AddVideoLecturesModal";
import DeleteModal from "../DeleteModal";
import { API_BASE_URL } from "../../Components/Service/apiService";
import PageHeader from "../Components/PageHeader";
import ModalButton from "../Components/ModalButton";
import StatCardGrid from "../Components/StatCardGrid";
import CategoryDropdownCustom from "../Components/CategoryDropdownCustom";

const categories = ["Aqeedah", "Fiqh", "Tafsir", "Hadith", "Seerah", "Akhlaq"];

const emptyFormData = {
  title: "",
  category: "",
  speaker: "",
  duration: "",
  thumbnail: "",
  description: "",
  videoUrl: "",
  featured: false,
};

const VideoLectures = () => {
  const [lectures, setLectures] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState(null);
  const [formData, setFormData] = useState(emptyFormData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLectures = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/videos`);
      if (!res.ok) throw new Error("Failed to fetch videos");
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
    setFormData(emptyFormData);
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
      thumbnail: lecture.thumbnail || "",
      description: lecture.description || "",
      videoUrl: lecture.url || lecture.videoUrl || "",
      featured: !!lecture.featured,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (lecture) => {
    setLectureToDelete(lecture);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setLectureToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleAddLecture = async () => {
    if (!formData.title || !formData.videoUrl) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/videos`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        body: JSON.stringify({
          title: formData.title,
          url: formData.videoUrl,
          description: formData.description,
          thumbnail: formData.thumbnail,
          duration: formData.duration,
          category: formData.category,
          speaker: formData.speaker,
          featured: formData.featured,
        }),
      });
      if (!res.ok) throw new Error("Failed to add video");
      await fetchLectures();
      setFormData(emptyFormData);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateLecture = async () => {
    if (!formData.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/videos/${formData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        body: JSON.stringify({
          title: formData.title,
          url: formData.videoUrl,
          description: formData.description,
          thumbnail: formData.thumbnail,
          duration: formData.duration,
          category: formData.category,
          speaker: formData.speaker,
          featured: formData.featured,
        }),
      });
      if (!res.ok) throw new Error("Failed to update video");
      await fetchLectures();
      setFormData(emptyFormData);
      setIsModalOpen(false);
      setIsEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteLecture = async () => {
    if (!lectureToDelete) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/videos/${lectureToDelete.id || lectureToDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      if (!res.ok) throw new Error("Failed to delete video");
      await fetchLectures();
      handleCloseDeleteModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredLectures = lectures.filter((lecture) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "published" && (lecture.status || "published") === "published") ||
      (activeTab === "drafts" && (lecture.status || "draft") === "draft") ||
      (activeTab === "featured" && lecture.featured);
    const title = (lecture.title || "").toLowerCase();
    const category = (lecture.category || "").toLowerCase();
    const speaker = (lecture.speaker || "").toLowerCase();
    const matchesSearch =
      title.includes(searchQuery.toLowerCase()) ||
      category.includes(searchQuery.toLowerCase()) ||
      speaker.includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || lecture.category === selectedCategory;
    return matchesTab && matchesSearch && matchesCategory;
  });

  const totalLectures = lectures.length;
  const publishedCount = lectures.filter(
    (l) => l.status === "published"
  ).length;
  const draftsCount = lectures.filter((l) => l.status === "draft").length;
  const totalViews = lectures.reduce((sum, l) => sum + l.views, 0);

  const stats = [
    { icon: Video, title: "Total Lectures", value: totalLectures },
    { icon: CheckCircle, title: "Published", value: publishedCount },
    { icon: Edit, title: "Drafts", value: draftsCount },
    {
      icon: TrendingUp,
      title: "Total Views",
      value: `${(totalViews / 1000).toFixed(1)}k`,
    },
  ];

  return (
    <div className="space-y-6 max-w-10xl mx-auto">
      <PageHeader
        title="Video Lectures Management"
        subtitle="Create and manage Islamic knowledge video lectures"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Lecture Library
        </h3>

        <div className="flex flex-col gap-3 mb-6">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lectures..."
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
            placeholder="Select Video Category"
          />
        </div>

        {filteredLectures.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredLectures.map((lecture) => (
              <div
                key={lecture.id}
                className="p-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex gap-4">
                  <div className="relative flex-shrink-0 w-32 h-20 bg-gray-200 rounded-lg overflow-hidden group cursor-pointer">
                    <img
                      src={lecture.thumbnail}
                      alt={lecture.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                      {lecture.duration}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        {lecture.featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1 cursor-pointer hover:text-emerald-600">
                            {lecture.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {lecture.speaker} •{" "}
                            {new Date(lecture.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleOpenEditModal(lecture)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(lecture)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                        <Tag className="w-3 h-3" /> {lecture.category}
                      </span>
                      {lecture.status === "published" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                          <CheckCircle className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full">
                          <Clock className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />{" "}
                        {lecture.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />{" "}
                        {lecture.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              No lectures found
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Try adjusting your filters or create a new lecture
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
            >
              Create Lecture
            </button>
          </div>
        )}
      </div>

      <AdminVideoLectureModal
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
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteLecture}
        itemTitle={lectureToDelete?.title || ""}
        itemType="Lecture"
        warningText="Deleting this lecture will permanently remove it from the system and user view."
      />

      <CreateCategoryModal
        show={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={() => {
          setShowCategoryModal(false);
        }}
        categories={categories}
        categoryType="video"
      />
    </div>
  );
};

export default VideoLectures;

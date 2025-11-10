import React, { useState } from "react";
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
import AdminLectureModal from "./AddLectureModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
const categories = ["Aqeedah", "Fiqh", "Tafsir", "Hadith", "Seerah", "Akhlaq"];


const initialLectures  = [
  {
    id: 1,
    title: "Complete Guide to Wudu and Salah",
    category: "Fiqh",
    speaker: "Dr. Fatima",
    status: "published",
    views: 18230,
    likes: 1890,
    dislikes: 23,
    comments: 134,
    date: "2024-10-20",
    duration: "52:15",
    thumbnail:
      "https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3", // Ablution hands
    featured: false,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description:
      "Learn the proper method of performing Wudu (ablution) and the five daily prayers according to authentic Sunnah. This detailed guide covers everything from the prerequisites to the completion of Salah.",
  },
  {
    id: 3,
    title: "The Biography of Prophet Muhammad (PBUH) - Part 1",
    category: "Seerah",
    speaker: "Ustadha Aishah",
    status: "published",
    views: 32100,
    likes: 3100,
    dislikes: 55,
    comments: 210,
    date: "2024-10-25",
    duration: "65:00",
    thumbnail:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop", // Desert and sunrise theme
    featured: true,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    description:
      "The first part of a series covering the life of the Prophet Muhammad, from his birth to the beginning of revelation. Essential for understanding Islamic history and his character.",
  },
  {
    id: 5,
    title: "Financial Transactions in Islam (Riba & Halal Earnings)",
    category: "Fiqh",
    speaker: "Dr. Hamza",
    status: "published",
    views: 11500,
    likes: 1020,
    dislikes: 15,
    comments: 75,
    date: "2024-10-28",
    duration: "40:00",
    thumbnail:
      "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=800&auto=format&fit=crop", // Finance/market theme
    featured: false,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    description:
      "A clear explanation of the Islamic rules concerning finance, distinguishing between permissible (Halal) and forbidden (Haram) forms of earning and investment, with a focus on avoiding Riba (usury/interest).",
  },
  {
    id: 6,
    title: "Inner Peace: Taming the Nafs (Soul)",
    category: "Tazkiyah",
    speaker: "Sheikh Ahmed",
    status: "published",
    views: 22800,
    likes: 2150,
    dislikes: 30,
    comments: 150,
    date: "2024-11-01",
    duration: "50:45",
    thumbnail:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop", // Calm landscape meditation theme
    featured: true,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndSnow.mp4",
    description:
      "A spiritual lesson on the concept of 'Nafs' (the soul or self), and practical steps for purification (Tazkiyah) to achieve inner tranquility and drawing closer to Allah.",
  },
];


const emptyFormData = {
  title: "",
  category: "",
  speaker: "",
  duration: "",
  thumbnail:
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400",
  description: "",
  videoUrl: "",
};

const VideoLecturesInterface = () => {
  const [lectures, setLectures] = useState(initialLectures);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState(null);
  const [formData, setFormData] = useState(emptyFormData);
  const [isEditMode, setIsEditMode] = useState(false);

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
    setFormData(lecture);
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

  const handleAddLecture = () => {
    if (
      formData.title &&
      formData.category &&
      formData.speaker &&
      formData.duration &&
      formData.videoUrl
    ) {
      const lecture = {
        id: lectures.length + 1,
        ...formData,
        views: 0,
        likes: 0,
        dislikes: 0,
        comments: 0,
        date: new Date().toISOString().split("T")[0],
        status: "draft",
        featured: false,
      };
      setLectures([...lectures, lecture]);
      setFormData(emptyFormData);
      setIsModalOpen(false);
    }
  };

  const handleUpdateLecture = () => {
    if (formData.id) {
      setLectures(
        lectures.map((l) => (l.id === formData.id ? { ...l, ...formData } : l))
      );
      setFormData(emptyFormData);
      setIsModalOpen(false);
      setIsEditMode(false);
    }
  };

  const handleDeleteLecture = () => {
    if (lectureToDelete) {
      setLectures(
        lectures.filter((lecture) => lecture.id !== lectureToDelete.id)
      );
      handleCloseDeleteModal();
    }
  };

  const filteredLectures = lectures.filter((lecture) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "published" && lecture.status === "published") ||
      (activeTab === "drafts" && lecture.status === "draft") ||
      (activeTab === "featured" && lecture.featured);
    const matchesSearch =
      lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.speaker.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <Video className="w-7 h-7 sm:w-9 sm:h-9" />
                Video Lectures Management
              </h1>
              <p className="text-emerald-50 text-sm sm:text-base">
                Create and manage Islamic knowledge video lectures
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
                className="bg-white rounded-xl shadow-sm p-4 sm:p-5 hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">
                  {stat.title}
                </h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Lecture Library
              </h3>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search lectures..."
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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
                  {
                    id: "featured",
                    label: "Featured",
                    count: lectures.filter((l) => l.featured).length,
                  },
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

              {filteredLectures.length === 0 && (
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
                </div>
              )}
            </div>
          </div>

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

              <button className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-md transition-all duration-200 group">
                <div className="p-1.5 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                  <Edit className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">
                  Review Drafts ({draftsCount})
                </span>
                <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button className="w-full flex items-center gap-3 p-3.5 border-2 border-emerald-100 bg-emerald-50 text-emerald-700 rounded-lg hover:border-emerald-200 hover:bg-emerald-100 transition-all duration-200 group">
                <div className="p-1.5 bg-emerald-100 rounded-md group-hover:bg-emerald-200 transition-colors">
                  <Eye className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">Preview Published</span>
                <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AdminLectureModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        handleChange={handleChange}
        handleAddLecture={handleAddLecture}
        handleUpdateLecture={handleUpdateLecture}
        categories={categories}
        isEditMode={isEditMode}
      />

      <DeleteConfirmModal
        show={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteLecture}
        itemTitle={lectureToDelete?.title || ""}
        itemType="Lecture"
        warningText="Deleting this lecture will permanently remove it from the system and user view."
      />
    </div>
  );
};

export default VideoLecturesInterface;

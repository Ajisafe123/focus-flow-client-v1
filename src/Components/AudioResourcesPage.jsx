import React, { useState } from "react";
import {
  Headphones,
  Search,
  Filter,
  Play,
  Pause,
  Download,
  Heart,
  Clock,
  User,
  Star,
  Volume2,
  Share2,
  BookOpen,
  ChevronDown,
  Mic,
} from "lucide-react";

const AUDIO_RESOURCES = [
  {
    id: 1,
    title: "Surah Al-Baqarah - Complete Recitation",
    category: "Quran Recitation",
    reciter: "Sheikh Mishary Rashid Alafasy",
    duration: "2:45:30",
    fileSize: "156 MB",
    rating: 4.9,
    reviews: 342,
    downloads: 5423,
    description:
      "Beautiful recitation of Surah Al-Baqarah with proper tajweed and melodious voice.",
    language: "Arabic",
    quality: "High Quality (320kbps)",
    releaseDate: "2024-10-15",
    thumbnail:
      "https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["Quran", "Complete Surah", "Tajweed"],
  },
  {
    id: 2,
    title: "40 Hadith Nawawi - Audio Commentary",
    category: "Hadith Lessons",
    reciter: "Dr. Yasir Qadhi",
    duration: "8:32:15",
    fileSize: "487 MB",
    rating: 4.8,
    reviews: 234,
    downloads: 3821,
    description:
      "Comprehensive explanation of the famous 40 Hadith collection with English commentary.",
    language: "English",
    quality: "Standard Quality (192kbps)",
    releaseDate: "2024-09-20",
    thumbnail:
      "https://images.pexels.com/photos/5943880/pexels-photo-5943880.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["Hadith", "Commentary", "Education"],
  },
  {
    id: 3,
    title: "Islamic History: The Rightly Guided Caliphs",
    category: "History Lectures",
    reciter: "Sheikh Omar Suleiman",
    duration: "6:15:45",
    fileSize: "356 MB",
    rating: 4.9,
    reviews: 187,
    downloads: 4156,
    description:
      "Detailed lectures covering the lives and legacies of the four Rightly Guided Caliphs.",
    language: "English",
    quality: "High Quality (320kbps)",
    releaseDate: "2024-11-01",
    thumbnail:
      "https://images.pexels.com/photos/2403209/pexels-photo-2403209.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["History", "Caliphs", "Biography"],
  },
  {
    id: 4,
    title: "Daily Duas and Supplications",
    category: "Dua Collections",
    reciter: "Sheikh Abdur Rahman As-Sudais",
    duration: "1:23:20",
    fileSize: "95 MB",
    rating: 4.7,
    reviews: 456,
    downloads: 7234,
    description:
      "Collection of essential daily duas with beautiful recitation and translation.",
    language: "Arabic & English",
    quality: "High Quality (320kbps)",
    releaseDate: "2024-10-28",
    thumbnail:
      "https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["Dua", "Daily", "Supplication"],
  },
  {
    id: 5,
    title: "Arabic Language Basics - Spoken Course",
    category: "Language Learning",
    reciter: "Ustadha Nouman Ali Khan",
    duration: "4:50:30",
    fileSize: "278 MB",
    rating: 4.8,
    reviews: 312,
    downloads: 4567,
    description:
      "Interactive audio course for learning conversational Arabic with proper pronunciation.",
    language: "English & Arabic",
    quality: "Standard Quality (192kbps)",
    releaseDate: "2024-09-15",
    thumbnail:
      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["Arabic", "Language", "Learning"],
  },
  {
    id: 6,
    title: "Stories of the Prophets",
    category: "Islamic Stories",
    reciter: "Sheikh Mufti Menk",
    duration: "12:15:00",
    fileSize: "698 MB",
    rating: 4.9,
    reviews: 523,
    downloads: 8945,
    description:
      "Engaging narration of prophetic stories with lessons and moral teachings.",
    language: "English",
    quality: "High Quality (320kbps)",
    releaseDate: "2024-10-05",
    thumbnail:
      "https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["Prophets", "Stories", "Inspiration"],
  },
];

const CATEGORIES = [
  "All Categories",
  "Quran Recitation",
  "Hadith Lessons",
  "History Lectures",
  "Dua Collections",
  "Language Learning",
  "Islamic Stories",
];

const LANGUAGES = ["All Languages", "Arabic", "English", "Arabic & English"];

const AudioCard = ({ audio }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600">
        <img
          src={audio.thumbnail}
          alt={audio.title}
          className="w-full h-full object-cover opacity-40 transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-10 h-10 text-emerald-600" />
            ) : (
              <Play className="w-10 h-10 text-emerald-600 ml-1" />
            )}
          </button>
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {audio.rating}
          </span>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <Headphones className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-600">
            {audio.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {audio.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {audio.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <Mic className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700 font-medium">
            {audio.reciter}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {audio.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{audio.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>{audio.quality.split(" ")[0]}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>{audio.downloads.toLocaleString()} downloads</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>{audio.language}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            Download ({audio.fileSize})
          </button>
          <button className="px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AudioResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAudios = AUDIO_RESOURCES.filter((audio) => {
    const matchesSearch =
      audio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audio.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audio.reciter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      audio.category === selectedCategory;
    const matchesLanguage =
      selectedLanguage === "All Languages" ||
      audio.language.includes(selectedLanguage);

    return matchesSearch && matchesCategory && matchesLanguage;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-16 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white">
              <Headphones className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight">
                Audio Resources
              </h1>
              <p className="text-emerald-100 text-lg mt-2">
                Listen and learn with our collection of Islamic audio content
              </p>
            </div>
          </div>

          <div className="relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, reciter, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white/30 focus:border-white text-gray-900 placeholder-gray-500 shadow-lg transition-all bg-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Filter Resources
              </h2>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-200 transition-colors flex items-center gap-2"
            >
              {showFilters ? "Hide" : "Show"} Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div
            className={`grid md:grid-cols-2 gap-4 ${
              showFilters ? "block" : "hidden lg:grid"
            }`}
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 outline-none transition-colors bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 outline-none transition-colors bg-white"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredAudios.length}
            </span>{" "}
            audio resources
          </p>
        </div>

        {filteredAudios.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <Headphones className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-2xl text-gray-600 font-bold mb-2">
                No audio resources found
              </p>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAudios.map((audio) => (
              <AudioCard key={audio.id} audio={audio} />
            ))}
          </div>
        )}

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white text-center shadow-2xl mt-16">
          <Volume2 className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-4">Premium Audio Collection</h3>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Get access to our exclusive collection of high-quality Islamic audio
            content from renowned scholars worldwide.
          </p>
          <button className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg">
            Explore Premium Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioResourcesPage;

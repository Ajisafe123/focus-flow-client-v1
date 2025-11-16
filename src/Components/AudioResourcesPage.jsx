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
  FileText,
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
    tags: ["Dua", "Daily", "Supplication"],
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

const AudioRow = ({ audio, isPlaying, onTogglePlay, isSelected, onSelect }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div
      className={`flex items-center p-4 sm:p-5 border-b border-gray-100 transition-all duration-200 cursor-pointer ${
        isSelected ? "bg-emerald-50 shadow-inner" : "bg-white hover:bg-gray-50"
      }`}
      onClick={() => onSelect(audio)}
    >
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center mr-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay(audio);
          }}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isPlaying
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          } shadow-md`}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>
      </div>

      <div className="flex-1 min-w-0 pr-4">
        <h3
          className={`text-base font-semibold truncate ${
            isSelected ? "text-emerald-800" : "text-gray-900"
          }`}
        >
          {audio.title}
        </h3>
        <p className="text-sm text-gray-500 truncate">
          <Mic className="w-3 h-3 inline mr-1" />
          {audio.reciter} &middot; {audio.category}
        </p>
      </div>

      <div className="hidden sm:block text-sm text-gray-600 flex-shrink-0 w-24 text-right">
        <div className="flex items-center justify-end">
          <Clock className="w-4 h-4 text-emerald-600 mr-1" />
          {audio.duration}
        </div>
      </div>

      <div className="hidden md:flex items-center flex-shrink-0 w-28 text-sm text-gray-600 justify-end mr-4">
        <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
        {audio.rating} ({audio.reviews})
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
        <a
          href="#"
          onClick={(e) => e.stopPropagation()}
          className="p-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors hidden lg:flex items-center"
        >
          <Download className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

const FilterDropdown = ({ label, value, options, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-600 outline-none transition-colors bg-white shadow-inner pr-10 text-gray-700 font-medium cursor-pointer hover:border-emerald-400 text-sm"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 pointer-events-none" />
      </div>
    </div>
  );
};

const AudioResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  const [showFilters, setShowFilters] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const handleTogglePlay = (audio) => {
    if (currentAudio && currentAudio.id === audio.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentAudio(audio);
      setIsPlaying(true);
    }
  };

  const handleSelectAudio = (audio) => {
    if (currentAudio && currentAudio.id === audio.id) {
      return;
    }
    setCurrentAudio(audio);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-12 sm:py-16 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border-2 border-white flex-shrink-0">
              <Headphones className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Audio Resources Library
              </h1>
              <p className="text-emerald-100 text-base sm:text-lg mt-1">
                Listen and learn with our collection of Islamic audio content
              </p>
            </div>
          </div>

          <div className="relative mt-6 sm:mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5 sm:w-6 sm:h-6" />
            <input
              type="text"
              placeholder="Search by title, reciter, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 sm:py-4 rounded-xl border-2 border-white/30 focus:border-white text-gray-900 placeholder-gray-500 shadow-md transition-all bg-white text-base"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            className={`grid md:grid-cols-2 gap-4 sm:gap-6 ${
              showFilters ? "block" : "hidden lg:grid"
            }`}
          >
            <FilterDropdown
              label="Category"
              value={selectedCategory}
              options={CATEGORIES}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
            <FilterDropdown
              label="Language"
              value={selectedLanguage}
              options={LANGUAGES}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredAudios.length}
            </span>{" "}
            matching audio resources
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {filteredAudios.length === 0 ? (
            <div className="text-center py-10">
              <Headphones className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-lg text-gray-600 font-bold mb-1">
                No audio resources found
              </p>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div>
              <div className="hidden sm:grid grid-cols-5 gap-4 px-5 py-3 border-b-2 border-emerald-100 bg-gray-50 text-sm font-bold text-gray-600">
                <div className="col-span-2">Title / Reciter</div>
                <div className="text-right">Duration</div>
                <div className="text-right">Rating (Reviews)</div>
                <div className="text-center">Actions</div>
              </div>
              {filteredAudios.map((audio) => (
                <AudioRow
                  key={audio.id}
                  audio={audio}
                  isPlaying={currentAudio?.id === audio.id && isPlaying}
                  onTogglePlay={handleTogglePlay}
                  isSelected={currentAudio?.id === audio.id}
                  onSelect={handleSelectAudio}
                />
              ))}
            </div>
          )}
        </div>

        {currentAudio && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-emerald-600 shadow-2xl p-4 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center min-w-0 pr-4">
                <button
                  onClick={() => handleTogglePlay(currentAudio)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors mr-4 ${
                    isPlaying
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  } shadow-lg`}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </button>
                <div className="min-w-0">
                  <p className="text-base font-bold truncate text-gray-900">
                    {currentAudio.title}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {currentAudio.reciter} &middot; {currentAudio.duration}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Volume2 className="w-5 h-5 text-gray-500 hidden sm:block" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="80"
                  className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer hidden sm:block"
                />
                <a
                  href="#"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 sm:p-10 text-white text-center shadow-lg mt-12">
          <Mic className="w-10 h-10 mx-auto mb-3" />
          <h3 className="text-2xl font-bold mb-3">
            Become an Audio Contributor
          </h3>
          <p className="text-emerald-100 text-sm mb-4 max-w-xl mx-auto">
            Share your recitations, lectures, or commentaries with our global
            community of learners and educators.
          </p>
          <button className="px-6 py-3 bg-white text-emerald-700 rounded-lg font-bold text-sm hover:bg-emerald-50 transition-colors shadow-md">
            Submit Your Audio
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioResourcesPage;

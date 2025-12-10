import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Star,
  Clock,
  Users,
  BookOpen,
  ChevronDown,
  Calendar,
  Printer,
  Share2,
  Heart,
  Tag,
} from "lucide-react";

import { fetchLessons } from "../Service/apiService";

const CATEGORIES = [
  "All Categories",
  "Quran Studies",
  "Hadith Studies",
  "Islamic History",
  "Fiqh & Jurisprudence",
  "Arabic Language",
  "Islamic Ethics",
];
const GRADE_LEVELS = [
  "All Levels",
  "Elementary (6-10 years)",
  "Middle School (11-14 years)",
  "High School (15-18 years)",
  "Adults", // Backend might have different values, assuming frontend consistency or permissive
];
const DIFFICULTIES = [
  "All Difficulties",
  "Beginner",
  "Intermediate",
  "Advanced",
];

const LessonCard = ({ lesson }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 group">
      <div className="relative h-44 sm:h-48 overflow-hidden bg-gray-100">
        <img
          src={lesson.thumbnail || lesson.image_url || "https://images.pexels.com/photos/8923569/pexels-photo-8923569.jpeg?auto=compress&cs=tinysrgb&w=400"}
          alt={lesson.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                }`}
            />
          </button>
          <button className="bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
            <Share2 className="w-5 h-5 text-emerald-600" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
          <span className="px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1 opacity-90">
            {lesson.difficulty}
          </span>
          <span className="px-3 py-1 bg-white text-gray-900 text-xs font-bold rounded-full flex items-center gap-1 shadow-lg opacity-90">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {lesson.rating || 0}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 border-b border-gray-100">
        <div className="flex items-center gap-1 mb-2">
          <Tag className="w-3 h-3 text-emerald-600" />
          <span className="text-xs font-bold uppercase text-emerald-600 tracking-wider">
            {lesson.category}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors">
          {lesson.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {lesson.description}
        </p>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4 text-teal-500" />
            <span className="font-semibold">{lesson.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="w-4 h-4 text-teal-500" />
            <span className="font-semibold">
              {(lesson.gradeLevel || "").split(" ")[0]}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Download className="w-4 h-4 text-teal-500" />
            <span className="font-semibold">
              {(lesson.downloads || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4 text-teal-500" />
            <span className="font-semibold">
              {new Date(lesson.created_at || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-emerald-50">
        <div className="flex gap-2">
          <button className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-bold text-sm hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg flex items-center justify-center gap-1">
            <Download className="w-4 h-4" />
            Get Plan
          </button>

          <button className="p-2.5 bg-white text-emerald-700 rounded-lg font-semibold hover:bg-emerald-200 transition-colors flex items-center justify-center shadow-md">
            <Eye className="w-5 h-5" />
          </button>
        </div>
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
          className="w-full appearance-none px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-600 outline-none transition-colors bg-white shadow-inner pr-10 text-gray-700 font-medium cursor-pointer hover:border-emerald-400"
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

const LessonPlansPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedGrade, setSelectedGrade] = useState("All Levels");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState("All Difficulties");
  const [showFilters, setShowFilters] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        setLoading(true);
        const data = await fetchLessons();
        setLessons(data);
      } catch (e) {
        console.error("Failed to load lessons", e);
      } finally {
        setLoading(false);
      }
    }
    loadLessons();
  }, []);

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lesson.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      lesson.category === selectedCategory;
    const matchesGrade =
      selectedGrade === "All Levels" || lesson.gradeLevel === selectedGrade;
    const matchesDifficulty =
      selectedDifficulty === "All Difficulties" ||
      lesson.difficulty === selectedDifficulty;

    return (
      matchesSearch && matchesCategory && matchesGrade && matchesDifficulty
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-12 sm:py-16 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border-2 border-white flex-shrink-0">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Lesson Plan Library
              </h1>
              <p className="text-emerald-100 text-base sm:text-lg mt-1">
                Comprehensive teaching resources for Islamic education
              </p>
            </div>
          </div>

          <div className="relative mt-6 sm:mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5 sm:w-6 sm:h-6" />
            <input
              type="text"
              placeholder="Search lesson plans by title, topic, or keywords..."
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
                Filter Results
              </h2>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-200 transition-colors flex items-center gap-2"
            >
              {showFilters ? "Hide" : "Show"} Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""
                  }`}
              />
            </button>
          </div>

          <div
            className={`grid md:grid-cols-3 gap-4 sm:gap-6 ${showFilters ? "block" : "hidden lg:grid"
              }`}
          >
            <FilterDropdown
              label="Category"
              value={selectedCategory}
              options={CATEGORIES}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
            <FilterDropdown
              label="Grade Level"
              value={selectedGrade}
              options={GRADE_LEVELS}
              onChange={(e) => setSelectedGrade(e.target.value)}
            />
            <FilterDropdown
              label="Difficulty"
              value={selectedDifficulty}
              options={DIFFICULTIES}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredLessons.length}
            </span>{" "}
            matching lesson plans
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
              <Printer className="w-4 h-4 text-emerald-600" />
              Print All
            </button>
          </div>
        </div>

        {filteredLessons.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-sm mx-auto border-2 border-emerald-200">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600 font-bold mb-2">
                No lesson plans found
              </p>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredLessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        )}

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 sm:p-10 text-white text-center shadow-lg mt-12">
          <BookOpen className="w-10 h-10 mx-auto mb-3" />
          <h3 className="text-2xl font-bold mb-3">Need Custom Lesson Plans?</h3>
          <p className="text-emerald-100 text-sm mb-4 max-w-xl mx-auto">
            Our team of educators can create customized lesson plans tailored to
            your specific needs and curriculum requirements.
          </p>
          <button className="px-6 py-3 bg-white text-emerald-700 rounded-lg font-bold text-sm hover:bg-emerald-50 transition-colors shadow-md">
            Request Custom Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonPlansPage;

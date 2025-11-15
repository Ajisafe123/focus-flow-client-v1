import React, { useState } from "react";
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

const LESSON_PLANS = [
  {
    id: 1,
    title: "Introduction to Salah - Complete Guide",
    category: "Fiqh & Jurisprudence",
    gradeLevel: "Elementary (6-10 years)",
    duration: "45 minutes",
    difficulty: "Beginner",
    downloads: 1234,
    rating: 4.9,
    reviews: 89,
    description:
      "Comprehensive lesson plan teaching children the basics of Islamic prayer including wudu, positions, and recitations.",
    objectives: [
      "Understand the importance of Salah",
      "Learn the five daily prayers",
      "Practice prayer positions",
    ],
    materials: ["Prayer mat", "Visual aids", "Worksheets"],
    tags: ["Prayer", "Basics", "Interactive"],
    author: "Dr. Fatima Ahmed",
    lastUpdated: "2024-11-10",
    thumbnail:
      "https://images.pexels.com/photos/8923569/pexels-photo-8923569.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 2,
    title: "Quran Memorization Techniques",
    category: "Quran Studies",
    gradeLevel: "Middle School (11-14 years)",
    duration: "60 minutes",
    difficulty: "Intermediate",
    downloads: 987,
    rating: 4.8,
    reviews: 67,
    description:
      "Effective strategies and methods for memorizing Quranic verses with proper tajweed and understanding.",
    objectives: [
      "Learn memorization techniques",
      "Apply tajweed rules",
      "Build consistent practice habits",
    ],
    materials: ["Quran", "Audio recordings", "Practice sheets"],
    tags: ["Memorization", "Tajweed", "Study Skills"],
    author: "Sheikh Mohammed Ali",
    lastUpdated: "2024-11-08",
    thumbnail:
      "https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 3,
    title: "Islamic History: The Golden Age",
    category: "Islamic History",
    gradeLevel: "High School (15-18 years)",
    duration: "90 minutes",
    difficulty: "Advanced",
    downloads: 756,
    rating: 4.9,
    reviews: 54,
    description:
      "Explore the Islamic Golden Age, its scientific achievements, and cultural contributions to world civilization.",
    objectives: [
      "Understand historical context",
      "Learn about key figures",
      "Analyze cultural impact",
    ],
    materials: ["Timeline charts", "Primary sources", "Discussion prompts"],
    tags: ["History", "Science", "Culture"],
    author: "Prof. Aisha Rahman",
    lastUpdated: "2024-11-05",
    thumbnail:
      "https://images.pexels.com/photos/256546/pexels-photo-256546.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 4,
    title: "Arabic Alphabet Mastery",
    category: "Arabic Language",
    gradeLevel: "Elementary (6-10 years)",
    duration: "45 minutes",
    difficulty: "Beginner",
    downloads: 1456,
    rating: 4.7,
    reviews: 112,
    description:
      "Fun and engaging lesson to teach children the Arabic alphabet with pronunciation and writing practice.",
    objectives: [
      "Recognize all Arabic letters",
      "Practice proper pronunciation",
      "Write basic letters",
    ],
    materials: ["Flashcards", "Writing worksheets", "Audio clips"],
    tags: ["Language", "Alphabet", "Writing"],
    author: "Ustadha Zainab Hassan",
    lastUpdated: "2024-11-12",
    thumbnail:
      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 5,
    title: "Prophetic Stories: Prophet Yusuf",
    category: "Hadith Studies",
    gradeLevel: "Middle School (11-14 years)",
    duration: "60 minutes",
    difficulty: "Intermediate",
    downloads: 892,
    rating: 4.8,
    reviews: 71,
    description:
      "Interactive lesson exploring the story of Prophet Yusuf with moral lessons and character building.",
    objectives: [
      "Learn the story narrative",
      "Extract moral lessons",
      "Apply to daily life",
    ],
    materials: ["Storybook", "Discussion cards", "Activity sheets"],
    tags: ["Prophets", "Stories", "Character"],
    author: "Sheikh Ibrahim Khan",
    lastUpdated: "2024-11-07",
    thumbnail:
      "https://images.pexels.com/photos/5943880/pexels-photo-5943880.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 6,
    title: "Islamic Ethics in Modern Life",
    category: "Islamic Ethics",
    gradeLevel: "High School (15-18 years)",
    duration: "75 minutes",
    difficulty: "Advanced",
    downloads: 654,
    rating: 4.9,
    reviews: 43,
    description:
      "Contemporary application of Islamic ethical principles in daily situations and decision-making.",
    objectives: [
      "Understand ethical framework",
      "Apply to real scenarios",
      "Develop moral reasoning",
    ],
    materials: ["Case studies", "Group activities", "Reflection journals"],
    tags: ["Ethics", "Modern", "Critical Thinking"],
    author: "Dr. Omar Siddiqui",
    lastUpdated: "2024-11-09",
    thumbnail:
      "https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

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
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={lesson.thumbnail}
          alt={lesson.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
            {lesson.difficulty}
          </span>
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {lesson.rating}
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
          <Tag className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-600">
            {lesson.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {lesson.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {lesson.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {lesson.tags.slice(0, 3).map((tag, idx) => (
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
            <span>{lesson.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>{lesson.gradeLevel.split(" ")[0]}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>{lesson.downloads} downloads</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>
              Updated {new Date(lesson.lastUpdated).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            Download
          </button>
          <button className="px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </button>
          <button className="px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
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

  const filteredLessons = LESSON_PLANS.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-16 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight">
                Lesson Plans
              </h1>
              <p className="text-emerald-100 text-lg mt-2">
                Comprehensive teaching resources for Islamic education
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search lesson plans by title, topic, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white/30 focus:border-white text-gray-900 placeholder-gray-500 shadow-lg transition-all bg-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Bar */}
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
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div
            className={`grid md:grid-cols-3 gap-4 ${
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
                Grade Level
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 outline-none transition-colors bg-white"
              >
                {GRADE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 outline-none transition-colors bg-white"
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredLessons.length}
            </span>{" "}
            lesson plans
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Print All
            </button>
          </div>
        </div>

        {filteredLessons.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-2xl text-gray-600 font-bold mb-2">
                No lesson plans found
              </p>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white text-center shadow-2xl mt-16">
          <h3 className="text-3xl font-bold mb-4">Need Custom Lesson Plans?</h3>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Our team of educators can create customized lesson plans tailored to
            your specific needs and curriculum requirements.
          </p>
          <button className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg">
            Request Custom Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonPlansPage;

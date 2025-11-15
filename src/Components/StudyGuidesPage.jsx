import React, { useState } from "react";
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Eye,
  Star,
  Clock,
  FileText,
  ChevronDown,
  Heart,
  Share2,
  CheckCircle,
  Target,
} from "lucide-react";

const STUDY_GUIDES = [
  {
    id: 1,
    title: "Complete Guide to Tajweed Rules",
    category: "Quran Studies",
    difficulty: "Intermediate",
    pages: 45,
    duration: "3-4 weeks",
    rating: 4.9,
    reviews: 234,
    downloads: 3421,
    description:
      "Comprehensive study guide covering all essential tajweed rules with practice exercises and examples.",
    topics: [
      "Makharij",
      "Sifaat",
      "Noon Sakinah",
      "Meem Sakinah",
      "Madd Rules",
    ],
    objectives: [
      "Master pronunciation",
      "Apply tajweed rules",
      "Improve recitation quality",
    ],
    thumbnail:
      "https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 2,
    title: "Hadith Studies: Essential Collections",
    category: "Hadith Studies",
    difficulty: "Beginner",
    pages: 62,
    duration: "5-6 weeks",
    rating: 4.8,
    reviews: 189,
    downloads: 2876,
    description:
      "Explore the six major hadith collections with authentication methods and practical applications.",
    topics: [
      "Sahih Bukhari",
      "Sahih Muslim",
      "Authentication",
      "Narrator Chain",
      "Hadith Sciences",
    ],
    objectives: [
      "Understand hadith classification",
      "Learn authentication methods",
      "Apply teachings",
    ],
    thumbnail:
      "https://images.pexels.com/photos/5943880/pexels-photo-5943880.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 3,
    title: "Islamic Jurisprudence Fundamentals",
    category: "Fiqh & Jurisprudence",
    difficulty: "Advanced",
    pages: 98,
    duration: "8-10 weeks",
    rating: 4.9,
    reviews: 145,
    downloads: 1987,
    description:
      "In-depth guide to usul al-fiqh, legal theory, and methodologies of the four major schools.",
    topics: [
      "Usul al-Fiqh",
      "Qiyas",
      "Ijma",
      "Ijtihad",
      "Four Schools Comparison",
    ],
    objectives: [
      "Understand legal principles",
      "Compare methodologies",
      "Develop analytical skills",
    ],
    thumbnail:
      "https://images.pexels.com/photos/4994726/pexels-photo-4994726.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 4,
    title: "Arabic Grammar Mastery",
    category: "Arabic Language",
    difficulty: "Intermediate",
    pages: 78,
    duration: "6-7 weeks",
    rating: 4.7,
    reviews: 298,
    downloads: 4123,
    description:
      "Step-by-step guide to Arabic grammar with exercises, examples, and practical applications.",
    topics: [
      "I'rab",
      "Verb Conjugation",
      "Sentence Structure",
      "Particles",
      "Grammar Rules",
    ],
    objectives: [
      "Master Arabic grammar",
      "Understand sentence structure",
      "Read classical texts",
    ],
    thumbnail:
      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 5,
    title: "Seerah Study Guide: Life of Prophet Muhammad",
    category: "Islamic History",
    difficulty: "Beginner",
    pages: 124,
    duration: "10-12 weeks",
    rating: 4.9,
    reviews: 412,
    downloads: 5234,
    description:
      "Chronological study of the Prophet's life with historical context, lessons, and reflections.",
    topics: [
      "Meccan Period",
      "Migration",
      "Battles",
      "Treaty of Hudaybiyyah",
      "Final Sermon",
    ],
    objectives: [
      "Learn prophetic biography",
      "Extract life lessons",
      "Understand historical context",
    ],
    thumbnail:
      "https://images.pexels.com/photos/2403209/pexels-photo-2403209.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 6,
    title: "Islamic Ethics and Morality",
    category: "Islamic Ethics",
    difficulty: "Intermediate",
    pages: 56,
    duration: "4-5 weeks",
    rating: 4.8,
    reviews: 176,
    downloads: 2654,
    description:
      "Practical guide to Islamic ethics, moral values, and character development in daily life.",
    topics: [
      "Akhlaq",
      "Character Traits",
      "Social Ethics",
      "Business Ethics",
      "Personal Development",
    ],
    objectives: [
      "Develop good character",
      "Apply ethical principles",
      "Improve relationships",
    ],
    thumbnail:
      "https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

const CATEGORIES = [
  "All Categories",
  "Quran Studies",
  "Hadith Studies",
  "Fiqh & Jurisprudence",
  "Arabic Language",
  "Islamic History",
  "Islamic Ethics",
];
const DIFFICULTIES = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const StudyGuideCard = ({ guide }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={guide.thumbnail}
          alt={guide.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
            {guide.difficulty}
          </span>
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {guide.rating}
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
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-600">
            {guide.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {guide.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {guide.description}
        </p>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-gray-700">
              Learning Objectives:
            </span>
          </div>
          <ul className="space-y-1">
            {guide.objectives.slice(0, 2).map((obj, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs text-gray-600"
              >
                <CheckCircle className="w-3 h-3 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>{guide.pages} pages</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{guide.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>{guide.downloads.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400" />
            <span>{guide.reviews} reviews</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            Download PDF
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

const StudyGuidesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [showFilters, setShowFilters] = useState(false);

  const filteredGuides = STUDY_GUIDES.filter((guide) => {
    const matchesSearch =
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      guide.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "All Levels" ||
      guide.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-16 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight">
                Study Guides
              </h1>
              <p className="text-emerald-100 text-lg mt-2">
                Comprehensive guides for structured Islamic learning
              </p>
            </div>
          </div>

          <div className="relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search study guides by topic or subject..."
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
              <h2 className="text-lg font-bold text-gray-900">Filter Guides</h2>
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
                Difficulty Level
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

        <div className="mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredGuides.length}
            </span>{" "}
            study guides
          </p>
        </div>

        {filteredGuides.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-2xl text-gray-600 font-bold mb-2">
                No study guides found
              </p>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide) => (
              <StudyGuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        )}

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white text-center shadow-2xl mt-16">
          <h3 className="text-3xl font-bold mb-4">Create Your Learning Path</h3>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Combine multiple study guides to create a personalized curriculum
            that matches your learning goals and schedule.
          </p>
          <button className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg">
            Build Custom Path
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyGuidesPage;

import React, { useState } from "react";
import {
  Lightbulb,
  Search,
  Download,
  Eye,
  Star,
  Heart,
  Share2,
  Zap,
} from "lucide-react";

const TOOLS = [
  {
    id: 1,
    title: "Interactive Salah Tracker",
    category: "Prayer Tools",
    type: "Digital Tool",
    rating: 4.9,
    reviews: 342,
    downloads: 5234,
    description:
      "Visual tracker for students to record and monitor their daily prayers with engaging graphics.",
    features: [
      "Daily tracking",
      "Progress charts",
      "Reminder system",
      "Rewards badges",
    ],
    thumbnail:
      "https://images.pexels.com/photos/8923569/pexels-photo-8923569.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 2,
    title: "Quran Memory Game Cards",
    category: "Learning Games",
    type: "Printable",
    rating: 4.8,
    reviews: 287,
    downloads: 4123,
    description:
      "Fun memory game cards featuring Arabic letters, Quranic verses, and Islamic concepts.",
    features: [
      "Printable cards",
      "Multiple levels",
      "Lesson integration",
      "Answer keys",
    ],
    thumbnail:
      "https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 3,
    title: "Islamic Calendar & Planner",
    category: "Classroom Management",
    type: "Template",
    rating: 4.7,
    reviews: 198,
    downloads: 3876,
    description:
      "Comprehensive Islamic calendar with lesson planning templates and important dates.",
    features: [
      "Monthly view",
      "Lesson planner",
      "Islamic dates",
      "Customizable",
    ],
    thumbnail:
      "https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 4,
    title: "Arabic Alphabet Flashcards",
    category: "Language Learning",
    type: "Printable",
    rating: 4.9,
    reviews: 456,
    downloads: 6789,
    description:
      "Beautiful flashcards with all Arabic letters including pronunciation guides and examples.",
    features: [
      "All 28 letters",
      "Pronunciation guide",
      "Example words",
      "Color coded",
    ],
    thumbnail:
      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 5,
    title: "Prophets Timeline Chart",
    category: "Visual Aids",
    type: "Poster",
    rating: 4.8,
    reviews: 234,
    downloads: 4567,
    description:
      "Large timeline poster showing all 25 prophets with key events and dates.",
    features: [
      "Visual timeline",
      "Key events",
      "High quality print",
      "Educational notes",
    ],
    thumbnail:
      "https://images.pexels.com/photos/2403209/pexels-photo-2403209.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 6,
    title: "Wudu Steps Poster",
    category: "Visual Aids",
    type: "Poster",
    rating: 4.9,
    reviews: 389,
    downloads: 5901,
    description:
      "Step-by-step illustrated guide for performing wudu correctly.",
    features: [
      "Clear illustrations",
      "Arabic & English",
      "Printable",
      "Multiple sizes",
    ],
    thumbnail:
      "https://images.pexels.com/photos/4994726/pexels-photo-4994726.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 7,
    title: "Islamic Trivia Quiz Generator",
    category: "Assessment Tools",
    type: "Digital Tool",
    rating: 4.7,
    reviews: 167,
    downloads: 3245,
    description:
      "Customizable quiz generator with hundreds of Islamic knowledge questions.",
    features: [
      "Question bank",
      "Custom quizzes",
      "Auto grading",
      "Progress tracking",
    ],
    thumbnail:
      "https://images.pexels.com/photos/5943880/pexels-photo-5943880.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 8,
    title: "Classroom Behavior Chart",
    category: "Classroom Management",
    type: "Template",
    rating: 4.6,
    reviews: 145,
    downloads: 2987,
    description:
      "Islamic-themed behavior tracking chart with positive reinforcement system.",
    features: [
      "Reward system",
      "Progress tracking",
      "Customizable",
      "Parent reports",
    ],
    thumbnail:
      "https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 9,
    title: "Hadith Study Worksheet Pack",
    category: "Worksheets",
    type: "Printable",
    rating: 4.8,
    reviews: 276,
    downloads: 4321,
    description:
      "Collection of worksheets for studying and memorizing important hadiths.",
    features: [
      "Multiple worksheets",
      "Different levels",
      "Answer keys",
      "Translation included",
    ],
    thumbnail:
      "https://images.pexels.com/photos/5943880/pexels-photo-5943880.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

const CATEGORIES = [
  "All Categories",
  "Prayer Tools",
  "Learning Games",
  "Classroom Management",
  "Language Learning",
  "Visual Aids",
  "Assessment Tools",
  "Worksheets",
];
const TYPES = ["All Types", "Digital Tool", "Printable", "Template", "Poster"];

const ToolCard = ({ tool }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={tool.thumbnail}
          alt={tool.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
            {tool.type}
          </span>
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {tool.rating}
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
          <Lightbulb className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-600">
            {tool.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {tool.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {tool.description}
        </p>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-gray-700">
              Features:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tool.features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>{tool.downloads.toLocaleString()} downloads</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400" />
            <span>{tool.reviews} reviews</span>
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

const TeachingToolsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState("All Types");

  const filteredTools = TOOLS.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      tool.category === selectedCategory;
    const matchesType =
      selectedType === "All Types" || tool.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-16 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight">
                Teaching Tools
              </h1>
              <p className="text-emerald-100 text-lg mt-2">
                Essential resources to enhance your Islamic classroom
              </p>
            </div>
          </div>

          <div className="relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search teaching tools and resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white/30 focus:border-white text-gray-900 placeholder-gray-500 shadow-lg transition-all bg-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-4">
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
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 outline-none transition-colors bg-white"
              >
                {TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
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
              {filteredTools.length}
            </span>{" "}
            teaching tools
          </p>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-2xl text-gray-600 font-bold mb-2">
                No tools found
              </p>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white text-center shadow-2xl mt-16">
          <Lightbulb className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-4">Submit Your Tool</h3>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Have a great teaching tool to share? Submit your resource and help
            educators worldwide.
          </p>
          <button className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg">
            Submit Resource
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeachingToolsPage;

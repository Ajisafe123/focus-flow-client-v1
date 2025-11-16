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
  Tag,
  Layers,
  ChevronDown,
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
    <div className="bg-white rounded-2xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 group">
      <div className="relative h-44 sm:h-48 overflow-hidden bg-gray-100">
        <img
          src={tool.thumbnail}
          alt={tool.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
          <button className="bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
            <Share2 className="w-5 h-5 text-emerald-600" />
          </button>
        </div>
        <span className="absolute top-3 left-3 z-10 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-xl flex items-center gap-1 opacity-90 animate-pulse">
          <Zap className="w-3 h-3 fill-white" />
          LIVE
        </span>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
          <span className="px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1 opacity-90">
            <Layers className="w-3 h-3" />
            {tool.type}
          </span>
          <span className="px-3 py-1 bg-white text-gray-900 text-xs font-bold rounded-full flex items-center gap-1 shadow-lg opacity-90">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {tool.rating}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 border-b border-gray-100">
        <div className="flex items-center gap-1 mb-2">
          <Tag className="w-3 h-3 text-emerald-600" />
          <span className="text-xs font-bold uppercase text-emerald-600 tracking-wider">
            {tool.category}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors">
          {tool.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {tool.description}
        </p>

        <div className="flex justify-between gap-4 text-sm pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-700">
            <Download className="w-4 h-4 text-teal-500" />
            <span className="font-semibold">
              {tool.downloads.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="font-semibold">{tool.reviews} Reviews</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-emerald-50">
        <div className="flex gap-2">
          <button className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-bold text-sm hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg flex items-center justify-center gap-1">
            <Download className="w-4 h-4" />
            Get Resource
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-12 sm:py-16 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border-2 border-white flex-shrink-0">
              <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Teaching Tools Marketplace
              </h1>
              <p className="text-emerald-100 text-base sm:text-lg mt-1">
                Explore essential resources for the Islamic classroom
              </p>
            </div>
          </div>

          <div className="relative mt-6 sm:mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5 sm:w-6 sm:h-6" />
            <input
              type="text"
              placeholder="Search tools and resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 sm:py-4 rounded-xl border-2 border-white/30 focus:border-white text-gray-900 placeholder-gray-500 shadow-md transition-all bg-white text-base"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <FilterDropdown
              label="Category"
              value={selectedCategory}
              options={CATEGORIES}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
            <FilterDropdown
              label="Type"
              value={selectedType}
              options={TYPES}
              onChange={(e) => setSelectedType(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredTools.length}
            </span>{" "}
            matching tools
          </p>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-sm mx-auto border-2 border-emerald-200">
              <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600 font-bold mb-2">
                No tools found
              </p>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 sm:p-10 text-white text-center shadow-lg mt-12">
          <Lightbulb className="w-10 h-10 mx-auto mb-3" />
          <h3 className="text-2xl font-bold mb-3">Submit Your Tool</h3>
          <p className="text-emerald-100 text-sm mb-4 max-w-xl mx-auto">
            Have a great teaching tool to share? Submit your resource and help
            educators worldwide.
          </p>
          <button className="px-6 py-3 bg-white text-emerald-700 rounded-lg font-bold text-sm hover:bg-emerald-50 transition-colors shadow-md">
            Submit Resource
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeachingToolsPage;

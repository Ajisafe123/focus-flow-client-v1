import React, { useState } from "react";
import {
  Search,
  Heart,
  Clock,
  User,
  Calendar,
  Eye,
  X,
  ArrowLeft,
  Share2,
  Lightbulb,
} from "lucide-react";

const MOCK_CATEGORIES = [
  {
    id: 1,
    name: "Faith & Spirituality",
    description:
      "Strengthen your understanding of Islamic faith and core beliefs",
    image_url:
      "https://images.pexels.com/photos/3394310/pexels-photo-3394310.jpeg?auto=compress&cs=tinysrgb&w=800",
    article_count: 12,
  },
  {
    id: 2,
    name: "Islamic Lifestyle",
    description: "Practical guidance for living a wholesome Islamic life",
    image_url:
      "https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=800",
    article_count: 18,
  },
  {
    id: 3,
    name: "Contemporary Issues",
    description: "Tackling modern challenges with Islamic wisdom",
    image_url:
      "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800",
    article_count: 15,
  },
  {
    id: 4,
    name: "Family & Relationships",
    description: "Building strong families through Islamic values",
    image_url:
      "https://images.pexels.com/photos/3791164/pexels-photo-3791164.jpeg?auto=compress&cs=tinysrgb&w=800",
    article_count: 10,
  },
];

const MOCK_ARTICLES = {
  1: [
    {
      id: 101,
      title: "The Six Pillars of Iman: A Complete Guide",
      excerpt:
        "Understanding the fundamental beliefs that form the foundation of Islamic faith...",
      author: "Sheikh Abdullah Rahman",
      published_date: "2024-10-15",
      read_time: 8,
      views: 1245,
      tags: ["Iman", "Faith"],
      is_favorite: false,
      image_url:
        "https://images.pexels.com/photos/3394310/pexels-photo-3394310.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: 102,
      title: "Understanding Tawheed: The Oneness of Allah",
      excerpt:
        "A comprehensive exploration of the concept of Tawheed and its three categories...",
      author: "Dr. Fatima Hassan",
      published_date: "2024-10-20",
      read_time: 10,
      views: 982,
      tags: ["Tawheed", "Monotheism"],
      is_favorite: true,
      image_url:
        "https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ],
  2: [
    {
      id: 201,
      title: "Daily Adhkar for a Balanced Life",
      excerpt:
        "Morning and evening supplications to protect and bless your day...",
      author: "Ustadha Aisha Khan",
      published_date: "2024-10-18",
      read_time: 6,
      views: 2156,
      tags: ["Dhikr", "Daily Routine"],
      is_favorite: false,
      image_url:
        "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ],
  3: [
    {
      id: 301,
      title: "Social Media and Mental Health in Islam",
      excerpt:
        "Navigating digital life while preserving spiritual well-being...",
      author: "Dr. Yusuf Ahmed",
      published_date: "2024-10-22",
      read_time: 9,
      views: 1834,
      tags: ["Mental Health", "Technology"],
      is_favorite: true,
      image_url:
        "https://images.pexels.com/photos/3791164/pexels-photo-3791164.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ],
  4: [
    {
      id: 401,
      title: "Raising Children with Islamic Values",
      excerpt:
        "Practical tips for parents to instill faith and character in children...",
      author: "Sister Maryam Ali",
      published_date: "2024-10-25",
      read_time: 11,
      views: 1567,
      tags: ["Parenting", "Family"],
      is_favorite: false,
      image_url:
        "https://images.pexels.com/photos/261857/pexels-photo-261857.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ],
};

const CategoryCard = ({ cat, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden w-full text-left transform hover:-translate-y-0.5 border border-gray-100"
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={cat.image_url}
          alt={cat.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.pexels.com/photos/261857/pexels-photo-261857.jpeg?auto=compress&cs=tinysrgb&w=800";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900 text-center group-hover:text-emerald-600 transition-colors line-clamp-2 mb-1">
          {cat.name}
        </h3>
        <p className="text-xs text-gray-600 text-center line-clamp-2">
          {cat.description}
        </p>
        <p className="text-xs text-gray-500 text-center mt-2 font-medium">
          {cat.article_count} articles
        </p>
      </div>
    </button>
  );
};

const ArticleCard = ({
  article,
  onReadMore,
  isAuthenticated,
  isLocallyFavorite,
  handleLocalToggle,
}) => {
  const isFavorite = isAuthenticated ? article.is_favorite : isLocallyFavorite;

  const handleLike = (e) => {
    e.stopPropagation();
    isAuthenticated
      ? {} // Placeholder for actual toggleFavorite
      : handleLocalToggle(article.id);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/article/${article.id}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  return (
    // Reverting max-w-xs on the card itself, letting the grid handle the width
    <article
      onClick={() => onReadMore(article)}
      className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-32 overflow-hidden w-full">
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.pexels.com/photos/261857/pexels-photo-261857.jpeg?auto=compress&cs=tinysrgb&w=800";
          }}
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={handleLike}
            className="p-1 rounded-full bg-white/80 backdrop-blur hover:bg-white transition-colors shadow-md"
            aria-label="Add to favorites"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-500 hover:text-red-500"
              }`}
            />
          </button>
          <button
            onClick={handleShare}
            className="p-1 rounded-full bg-white/80 backdrop-blur hover:bg-white transition-colors shadow-md"
            aria-label="Share article"
          >
            <Share2 className="w-4 h-4 text-gray-500 hover:text-emerald-600" />
          </button>
        </div>
      </div>

      <div className="p-3 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-1">
            {article.title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap gap-1 mb-2">
            {article.tags.slice(0, 2).map((t, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 text-emerald-600" />
              <span className="font-medium text-gray-700 text-[11px]">
                {article.author}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className="text-[11px]">{article.read_time} min</span>
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span className="text-[11px]">{article.views}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

const ArticlesPage = ({ categoryId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCatId, setSelectedCatId] = useState(categoryId || null);
  const [view, setView] = useState(categoryId ? "articles" : "categories");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [localFavorites, setLocalFavorites] = useState(new Set());

  const currentArticles = selectedCatId
    ? MOCK_ARTICLES[selectedCatId] || []
    : [];

  const filteredArticles = currentArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCatClick = (id) => {
    setSelectedCatId(id);
    setView("articles");
    setSearchTerm("");
  };

  const backToCats = () => {
    setView("categories");
    setSelectedCatId(null);
    setSearchTerm("");
    setSelectedArticle(null);
  };

  const readMore = (art) => {
    setSelectedArticle(art);
    setView("detail");
  };

  const closeDetail = () => {
    setView("articles");
    setSelectedArticle(null);
  };

  const toggleLocal = (id) => {
    setLocalFavorites((s) => {
      const ns = new Set(s);
      ns.has(id) ? ns.delete(id) : ns.add(id);
      return ns;
    });
  };

  const currentCat = MOCK_CATEGORIES.find((c) => c.id === selectedCatId);

  const showCategories = view === "categories";

  if (view === "detail" && selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={closeDetail}
            className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 font-medium mb-5 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </button>
          <article className="bg-white rounded-xl shadow-xl p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedArticle.title}
            </h1>
            <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-5">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {selectedArticle.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(selectedArticle.published_date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {selectedArticle.read_time} min
              </span>
            </div>
            <p className="text-base text-gray-700 mb-5 italic">
              {selectedArticle.excerpt}
            </p>
            <p className="text-gray-700 leading-relaxed text-sm">
              This is a mock article. Full content would appear here.
            </p>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      {/* Revert to wider container for header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-10 sm:py-12 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-md flex items-center justify-center border-2 border-white flex-shrink-0">
              <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {currentCat?.name || "Islamic Articles"}
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base mt-1">
                {currentCat?.description ||
                  "Explore insightful articles on Islamic knowledge and guidance"}
              </p>
            </div>
          </div>

          <div className="mt-5 sm:mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 sm:py-3 rounded-lg border-2 border-white/30 focus:border-white text-gray-900 placeholder-gray-500 shadow-md transition-all bg-white text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {!showCategories && (
              <div className="mt-3 flex justify-start">
                <button
                  onClick={backToCats}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5"
                  aria-label="Back to all categories"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Categories
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revert to wider container for main content */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        {showCategories ? (
          // Category Grid remains the same
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {MOCK_CATEGORIES.map((c) => (
              <CategoryCard
                key={c.id}
                cat={c}
                onClick={() => handleCatClick(c.id)}
              />
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          // **CHANGE HERE:** Increased columns to 4 (lg:grid-cols-4) and 5 (xl:grid-cols-5)
          // to make the Article Cards narrower within the available space.
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredArticles.map((a) => (
              <ArticleCard
                key={a.id}
                article={a}
                onReadMore={readMore}
                isAuthenticated={false}
                isLocallyFavorite={localFavorites.has(a.id)}
                handleLocalToggle={toggleLocal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-sm mx-auto">
              <Search className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-xl text-gray-600 font-bold mb-2">
                No articles found
              </p>
              <p className="text-gray-500 text-sm">
                Try a different search term.
              </p>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-white text-gray-600 py-6 mt-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-light">
            Nibras © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ArticlesPage;

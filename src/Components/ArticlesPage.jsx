import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Loader2,
  Search,
  Heart,
  Clock,
  User,
  Tag,
  Share2,
  Home,
  X,
  Calendar,
  Eye,
} from "lucide-react";

const DEMO_CATEGORIES = [
  {
    id: 1,
    name: "Faith & Beliefs",
    description:
      "Strengthen your understanding of Islamic faith and core beliefs",
    image_url:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400",
    article_count: 12,
  },
  {
    id: 2,
    name: "Quran & Tafsir",
    description:
      "Deep insights into the meanings and interpretations of the Quran",
    image_url:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400",
    article_count: 18,
  },
  {
    id: 3,
    name: "Prophetic Guidance",
    description: "Learn from the teachings and life of Prophet Muhammad ﷺ",
    image_url:
      "https://images.unsplash.com/photo-1584286595398-a59f21d75b4b?w=400",
    article_count: 15,
  },
  {
    id: 4,
    name: "Islamic History",
    description: "Explore the rich history and heritage of Islam",
    image_url:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400",
    article_count: 10,
  },
  {
    id: 5,
    name: "Spiritual Growth",
    description: "Nurture your soul and strengthen your connection with Allah",
    image_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    article_count: 20,
  },
  {
    id: 6,
    name: "Islamic Lifestyle",
    description: "Practical guidance for living a wholesome Islamic life",
    image_url:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400",
    article_count: 14,
  },
];

const DEMO_ARTICLES = {
  1: [
    {
      id: 1,
      title: "The Six Pillars of Iman: A Complete Guide",
      excerpt:
        "Understanding the fundamental beliefs that form the foundation of Islamic faith, including belief in Allah, angels, books, prophets, the Day of Judgment, and divine decree.",
      content: `The Six Pillars of Iman represent the core beliefs that every Muslim must hold. These pillars are not just abstract concepts but living principles that shape our daily lives and worldview.

**1. Belief in Allah (God)**
The first and most important pillar is belief in Allah - the One, Unique, Supreme Being who created everything. Allah has no partners, no equals, and no offspring. He is the Creator, Sustainer, and Controller of all that exists.

**2. Belief in the Angels**
Angels are created from light and are devoted servants of Allah. They carry out His commands perfectly and never disobey. The most well-known angels include Jibreel (Gabriel), Mikaeel (Michael), Israfeel, and the Angel of Death.

**3. Belief in the Divine Books**
Muslims believe in all the divine books revealed by Allah, including the Torah, Psalms, Gospel, and the Quran - the final and preserved revelation.

**4. Belief in the Prophets**
From Adam to Muhammad (peace be upon them all), Allah sent prophets to guide humanity. Muhammad ﷺ is the final prophet, and his message is for all of mankind until the Day of Judgment.

**5. Belief in the Day of Judgment**
Every person will be resurrected and held accountable for their deeds. This belief motivates us to live righteously and seek Allah's pleasure in all our actions.

**6. Belief in Divine Decree (Qadar)**
Everything happens by Allah's will and knowledge. While we have free will to make choices, Allah's wisdom encompasses all that was, is, and will be.`,
      author: "Sheikh Abdullah Rahman",
      category_id: 1,
      read_time: 8,
      views: 1245,
      published_date: "2024-10-15",
      tags: ["Iman", "Faith", "Beliefs", "Islamic Foundations"],
      is_favorite: false,
    },
    {
      id: 2,
      title: "Understanding Tawheed: The Oneness of Allah",
      excerpt:
        "A comprehensive exploration of the concept of Tawheed and its three categories: Tawheed ar-Rububiyyah, Tawheed al-Uluhiyyah, and Tawheed al-Asma was-Sifat.",
      content: `Tawheed, the belief in the absolute Oneness of Allah, is the cornerstone of Islam. It is not merely a theological concept but a transformative principle that affects every aspect of a Muslim's life.

**The Three Categories of Tawheed**

**1. Tawheed ar-Rububiyyah (Oneness of Lordship)**
This involves believing that Allah alone is the Creator, Provider, and Sustainer of all existence. He alone has power over life and death, and all affairs return to Him.

**2. Tawheed al-Uluhiyyah (Oneness of Worship)**
This means directing all acts of worship exclusively to Allah. No one deserves worship except Him - not prophets, angels, saints, or any created being.

**3. Tawheed al-Asma was-Sifat (Oneness of Names and Attributes)**
We must believe in Allah's names and attributes as He described Himself in the Quran and as His Messenger ﷺ described Him, without distortion, denial, or likening Him to His creation.

**Practical Implications**
Understanding Tawheed transforms how we live. It means turning to Allah alone in times of need, seeking His help exclusively, and recognizing that all good comes from Him. It liberates us from fear of others and brings true peace to the heart.`,
      author: "Dr. Fatima Hassan",
      category_id: 1,
      read_time: 10,
      views: 982,
      published_date: "2024-10-20",
      tags: ["Tawheed", "Monotheism", "Core Beliefs"],
      is_favorite: true,
    },
  ],
  2: [
    {
      id: 3,
      title: "The Miraculous Nature of the Quran",
      excerpt:
        "Exploring the linguistic, scientific, and prophetic miracles found within the final revelation to mankind.",
      content: `The Quran stands as the eternal miracle of Prophet Muhammad ﷺ. Unlike the miracles of previous prophets that were witnessed by their contemporaries, the Quran's miracle is accessible to every generation.

**Linguistic Excellence**
The Arabic of the Quran represents the pinnacle of eloquence and rhetoric. Its style is unique - neither poetry nor prose, yet more beautiful than both. Arabs of the Prophet's time, masters of their language, acknowledged they could never produce anything like it.

**Scientific Insights**
The Quran contains references to natural phenomena that were only discovered centuries later: embryological development, the water cycle, the expanding universe, and the protective nature of mountains.

**Preserved and Unchanged**
Unlike other scriptures, the Quran has been perfectly preserved for over 1400 years. Not a single letter has changed, fulfilling Allah's promise: "Indeed, it is We who sent down the Quran and indeed, We will be its guardian." (15:9)

**Prophetic Accuracy**
The Quran made predictions that came true, such as the Roman victory over the Persians within a specific timeframe, and the protection of Pharaoh's body as a sign for future generations.`,
      author: "Sheikh Muhammad Al-Bakri",
      category_id: 2,
      read_time: 12,
      views: 2156,
      published_date: "2024-10-18",
      tags: ["Quran", "Miracles", "Divine Revelation"],
      is_favorite: false,
    },
  ],
  3: [
    {
      id: 4,
      title: "The Noble Character of Prophet Muhammad ﷺ",
      excerpt:
        "Learn about the exemplary character traits that made the Prophet ﷺ a mercy to all of mankind.",
      content: `The character of Prophet Muhammad ﷺ was so perfect that Allah praised him in the Quran: "And indeed, you are of a great moral character." (68:4)

**Truthfulness and Trustworthiness**
Even before prophethood, he was known as "Al-Amin" (The Trustworthy). His enemies entrusted their valuables to him, and he never broke a promise.

**Compassion and Mercy**
He ﷺ showed mercy to everyone - believers and non-believers, humans and animals. He taught that "those who show mercy will be shown mercy by the Most Merciful."

**Humility**
Despite being Allah's final messenger, he lived simply, mended his own clothes, and served in his household. He forbade people from standing when he entered, saying he was just a man.

**Forgiveness**
He forgave those who wronged him terribly. When he conquered Makkah, he pardoned his enemies who had persecuted Muslims for years.

**Justice**
He was just in all his dealings, never showing favoritism based on status or relationship. He said, "If Fatima, the daughter of Muhammad, were to steal, I would cut off her hand."`,
      author: "Sheikh Abdullah Rahman",
      category_id: 3,
      read_time: 9,
      views: 1834,
      published_date: "2024-10-22",
      tags: ["Prophet Muhammad", "Seerah", "Character", "Ethics"],
      is_favorite: true,
    },
  ],
  4: [
    {
      id: 5,
      title: "The Golden Age of Islamic Civilization",
      excerpt:
        "Discover how Islamic civilization contributed to world knowledge in science, mathematics, medicine, and philosophy.",
      content: `The period between the 8th and 14th centuries is often called the Islamic Golden Age - a time when Muslim scholars made groundbreaking contributions to human knowledge.

**Scientific Achievements**
Muslim scientists like Al-Khwarizmi (father of algebra), Ibn al-Haytham (pioneer of optics), and Al-Biruni made discoveries that laid the foundation for modern science.

**Medical Advances**
Ibn Sina's (Avicenna) "Canon of Medicine" was used as a standard medical text in Europe for centuries. Muslim physicians developed hospitals, pharmacies, and surgical techniques.

**Architectural Marvels**
From the Alhambra in Spain to the Taj Mahal in India, Islamic architecture combined beauty with mathematical precision, creating structures that still inspire awe today.

**Preservation of Knowledge**
Muslim scholars translated and preserved Greek, Persian, and Indian texts, ensuring their survival and transmission to future generations.`,
      author: "Dr. Aisha Ibrahim",
      category_id: 4,
      read_time: 11,
      views: 1567,
      published_date: "2024-10-25",
      tags: ["Islamic History", "Golden Age", "Civilization", "Science"],
      is_favorite: false,
    },
  ],
  5: [
    {
      id: 6,
      title: "Purifying the Heart: The Path to Spiritual Excellence",
      excerpt:
        "Understanding the diseases of the heart and the remedies prescribed by Islam for spiritual purification.",
      content: `The heart is the center of our being. The Prophet ﷺ said: "In the body there is a piece of flesh; if it is sound, the whole body is sound, and if it is corrupt, the whole body is corrupt. It is the heart."

**Diseases of the Heart**
Spiritual ailments like pride, envy, showing off, love of status, and attachment to the world can corrupt the heart and distance us from Allah.

**The Cure: Remembrance of Allah**
The Quran states: "Verily, in the remembrance of Allah do hearts find rest." (13:28) Regular dhikr, prayer, and Quran recitation polish the heart.

**Self-Accountability**
The practice of muhasabah (self-accountability) involves regularly examining our actions, intentions, and thoughts, seeking forgiveness for shortcomings.

**Seeking Knowledge**
Understanding our purpose and Allah's attributes increases our love for Him and strengthens our resolve to worship Him properly.

**Good Company**
Surrounding ourselves with righteous people who remind us of Allah and encourage good deeds is essential for spiritual growth.`,
      author: "Sheikh Yusuf Al-Qaradawi",
      category_id: 5,
      read_time: 10,
      views: 2445,
      published_date: "2024-10-28",
      tags: ["Spirituality", "Heart Purification", "Ihsan", "Taqwa"],
      is_favorite: true,
    },
  ],
  6: [
    {
      id: 7,
      title: "Halal Earnings and Islamic Business Ethics",
      excerpt:
        "Guidelines for conducting business and earning wealth in accordance with Islamic principles.",
      content: `Islam provides comprehensive guidance on how to earn and spend wealth ethically and responsibly.

**Principles of Halal Earnings**
- Avoid riba (interest/usury)
- No dealings in haram goods (alcohol, pork, etc.)
- Honesty in transactions
- Fair pricing and weights
- Fulfilling contracts and agreements

**Business Ethics**
The Prophet ﷺ said: "The truthful and trustworthy merchant will be with the prophets, the truthful, and the martyrs." This shows the high status of honest business people in Islam.

**Prohibited Practices**
- Cheating or deception
- Hoarding to manipulate prices
- Selling defective goods without disclosure
- Gambling and speculation
- Monopolistic practices

**Wealth as a Trust**
Muslims view wealth as an amanah (trust) from Allah. We are stewards, not absolute owners, and will be questioned about how we earned and spent our money.

**Charity and Social Responsibility**
Zakah (obligatory charity) and sadaqah (voluntary charity) are mechanisms to distribute wealth and help those in need, preventing the concentration of wealth in few hands.`,
      author: "Dr. Muhammad Taqi Usmani",
      category_id: 6,
      read_time: 13,
      views: 1923,
      published_date: "2024-10-30",
      tags: ["Halal", "Business", "Ethics", "Islamic Finance"],
      is_favorite: false,
    },
  ],
};

const CategoryCard = ({ category, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden w-full text-left transform hover:-translate-y-1"
    >
      <div className="relative h-48 bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-50 overflow-hidden">
        <img
          src={category.image_url}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 text-center group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
          {category.name}
        </h3>
        <p className="text-sm text-gray-600 text-center line-clamp-2">
          {category.description}
        </p>
      </div>
    </button>
  );
};

const ArticleCard = ({
  article,
  toggleFavorite,
  isAuthenticated,
  isLocallyFavorite,
  handleLocalToggle,
  onReadMore,
}) => {
  const isFavorite = isAuthenticated ? article.is_favorite : isLocallyFavorite;

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      handleLocalToggle(article.id);
    } else {
      toggleFavorite(article.id);
    }
  };

  return (
    <article
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer group"
      onClick={() => onReadMore(article)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
              {article.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{article.read_time} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{article.views}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLikeClick}
            className="p-2 rounded-full hover:bg-red-50 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400 hover:text-red-500"
              }`}
            />
          </button>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span className="font-medium">{article.author}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{new Date(article.published_date).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {article.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

const ArticleDetailModal = ({
  article,
  onClose,
  toggleFavorite,
  isAuthenticated,
  isLocallyFavorite,
  handleLocalToggle,
}) => {
  if (!article) return null;

  const isFavorite = isAuthenticated ? article.is_favorite : isLocallyFavorite;

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      handleLocalToggle(article.id);
    } else {
      toggleFavorite(article.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-3xl flex justify-between items-start z-10">
          <div className="flex-1 pr-4">
            <h2 className="text-3xl font-bold mb-3">{article.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(article.published_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.read_time} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{article.views} views</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleLikeClick}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorite ? "fill-white text-white" : "text-white"
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
            <p className="text-gray-800 leading-relaxed italic">
              {article.excerpt}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            {article.content.split("\n\n").map((paragraph, index) => {
              if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                return (
                  <h3
                    key={index}
                    className="text-2xl font-bold text-gray-900 mt-6 mb-3"
                  >
                    {paragraph.replace(/\*\*/g, "")}
                  </h3>
                );
              }
              return (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph.split("**").map((part, i) =>
                    i % 2 === 0 ? (
                      part
                    ) : (
                      <strong key={i} className="font-bold text-gray-900">
                        {part}
                      </strong>
                    )
                  )}
                </p>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold hover:bg-blue-100 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              Close Article
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArticlesPage = ({ categoryId }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [localFavorites, setLocalFavorites] = useState(new Set());
  const [view, setView] = useState(categoryId ? "articles" : "categories");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filteredArticles, setFilteredArticles] = useState([]);

  const isAuthenticated = false;

  useEffect(() => {
    setTimeout(() => {
      setCategories(DEMO_CATEGORIES);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (categoryId) {
      setSelectedCategoryId(categoryId);
      setView("articles");
    }
  }, [categoryId]);

  useEffect(() => {
    if (selectedCategoryId && DEMO_ARTICLES[selectedCategoryId]) {
      let articles = DEMO_ARTICLES[selectedCategoryId];
      if (searchTerm) {
        articles = articles.filter(
          (article) =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
      }
      setFilteredArticles(articles);
    }
  }, [selectedCategoryId, searchTerm]);

  const handleLocalToggle = (articleId) => {
    setLocalFavorites((prevSet) => {
      const newSet = new Set(prevSet);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const toggleFavorite = (articleId) => {
    console.log("Toggle favorite for article:", articleId);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategoryId(catId);
    setView("articles");
  };

  const handleBackToCategories = () => {
    setView("categories");
    setSelectedCategoryId(null);
    setSearchTerm("");
    setSelectedArticle(null);
  };

  const handleReadMore = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading Articles...</p>
      </div>
    );
  }

  const currentCategory = selectedCategoryId
    ? categories.find((cat) => cat.id === selectedCategoryId)
    : null;

  const pageTitle = currentCategory?.name || "Islamic Articles";
  const categoryDescription =
    currentCategory?.description ||
    "Explore insightful articles on Islamic knowledge and guidance";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white py-12 border-b-4 border-blue-700 shadow-2xl">
        <div className="max-w-7xl mx-auto text-center px-4">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-xl">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-3">
            {pageTitle}
          </h1>
          <p className="text-lg text-blue-50 font-light mx-auto max-w-3xl leading-relaxed">
            {categoryDescription}
          </p>
        </div>
      </div>

      {view === "categories" && (
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto py-5 px-4">
            <div
              className={`relative transition-all duration-300 ${
                searchFocused ? "transform scale-105" : ""
              }`}
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search for articles by title, content, or tags..."
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-gray-700 placeholder-gray-400 text-base shadow-sm transition-all duration-300 bg-white"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-600 mt-3 text-center">
                Searching for:{" "}
                <span className="font-semibold text-blue-600">
                  "{searchTerm}"
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      {view === "articles" && !categoryId && (
        <div className="max-w-7xl mx-auto px-4 py-5 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-md">
          <button
            onClick={handleBackToCategories}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full"
          >
            <Home className="w-5 h-5" />
            Back to Categories
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-10 px-4">
        {view === "categories" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onClick={() => handleCategoryClick(cat.id)}
              />
            ))}
          </div>
        ) : (
          currentCategory && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  toggleFavorite={toggleFavorite}
                  isAuthenticated={isAuthenticated}
                  isLocallyFavorite={localFavorites.has(article.id)}
                  handleLocalToggle={handleLocalToggle}
                  onReadMore={handleReadMore}
                />
              ))}
            </div>
          )
        )}

        {view === "articles" && filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-2xl text-gray-600 font-bold mb-2">
                No articles found
              </p>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </div>
          </div>
        )}

        {categories.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-2xl text-gray-600 font-bold mb-2">
                No categories found
              </p>
              <p className="text-gray-500">Check back later for more content</p>
            </div>
          </div>
        )}
      </div>

      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={handleCloseArticle}
          toggleFavorite={toggleFavorite}
          isAuthenticated={isAuthenticated}
          isLocallyFavorite={localFavorites.has(selectedArticle.id)}
          handleLocalToggle={handleLocalToggle}
        />
      )}

      <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 mt-16 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-base font-light">
            Seeking knowledge is an obligation upon every Muslim
          </p>
          <p className="text-sm text-blue-100 mt-2">بَارَكَ اللَّهُ فِيكُمْ</p>
        </div>
      </footer>
    </div>
  );
};

export default ArticlesPage;

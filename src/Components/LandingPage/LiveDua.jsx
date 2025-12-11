import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Sun,
  Moon,
  Play,
  Pause,
  Repeat,
  RotateCcw,
  BookOpenCheck,
  ArrowRight,
  Heart,
  Share2,
  MessageSquare,
} from "lucide-react";
import apiService, { API_BASE_URL as ROOT_API } from "../Service/apiService";

const isUserLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export default function LiveDua() {
  const [morningAdkar, setMorningAdkar] = useState([]);
  const [eveningAdkar, setEveningAdkar] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isPlayingMorning, setIsPlayingMorning] = useState(false);
  const [isPlayingEvening, setIsPlayingEvening] = useState(false);
  const [morningProgress, setMorningProgress] = useState(0);
  const [eveningProgress, setEveningProgress] = useState(0);
  const [morningDuration, setMorningDuration] = useState(0);
  const [eveningDuration, setEveningDuration] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [morningSegments, setMorningSegments] = useState([]);
  const [eveningSegments, setEveningSegments] = useState([]);
  const [highlightedMorningSegmentIndex, setHighlightedMorningSegmentIndex] =
    useState(-1);
  const [highlightedEveningSegmentIndex, setHighlightedEveningSegmentIndex] =
    useState(-1);

  const [isMorningLiked, setIsMorningLiked] = useState(false);
  const [isEveningLiked, setIsEveningLiked] = useState(false);
  const [morningFavoriteCount, setMorningFavoriteCount] = useState(0);
  const [eveningFavoriteCount, setEveningFavoriteCount] = useState(0);

  const morningAudioRef = useRef(null);
  const eveningAudioRef = useRef(null);
  const morningListRef = useRef(null);
  const eveningListRef = useRef(null);
  const morningDuaRefs = useRef([]);
  const eveningDuaRefs = useRef([]);
  const morningSegmentRefs = useRef({});
  const eveningSegmentRefs = useRef({});
  const STATIC_BASE_URL = ROOT_API;
  const FRONTEND_BASE_URL = "https://nibrasudeen.vercel.app/";
  const LOGIN_URL = `${FRONTEND_BASE_URL}/login`;

  const formatTime = (t) =>
    !t || isNaN(t)
      ? "00:00"
      : `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(
        Math.floor(t % 60)
      ).padStart(2, "0")}`;

  const getFullImageUrl = (relativePath) => {
    if (!relativePath) return null;
    if (relativePath.startsWith("http")) return relativePath;
    let path = relativePath.trim();
    if (!path.startsWith("/static/")) {
      path = `/static/category_images/${path}`;
    }
    if (path.startsWith("//")) {
      path = path.replace(/^\/+/, "/");
    }
    return `${STATIC_BASE_URL}${path}`;
  };

  const [morningId, setMorningId] = useState(null);
  const [eveningId, setEveningId] = useState(null);

  const fetchSegmentsData = useCallback(
    async (categoryId) => {
      try {
        if (!categoryId) return [];
        const data = await apiService.getCategorySegments(categoryId);
        return data?.arabic_segments || [];
      } catch {
        return [];
      }
    },
    []
  );

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      // 1. Fetch Categories first to find IDs
      const cats = await apiService.getDuaCategories();
      const morningCat = cats.find(c => c.name.toLowerCase().includes("morning"));
      const eveningCat = cats.find(c => c.name.toLowerCase().includes("evening"));

      const mId = morningCat ? morningCat.id : 5;
      const eId = eveningCat ? eveningCat.id : 6;

      setMorningId(mId);
      setEveningId(eId);

      // Filter out Morning/Evening from the "Explore More" list
      const filtered = (cats || [])
        .filter((cat) => cat.id !== mId && cat.id !== eId)
        .slice(0, 6);
      setCategories(filtered);

      // 2. Fetch Duas
      const data = await apiService.getDuas(token);
      if (Array.isArray(data)) {
        // Robust ID comparison (handle string vs int)
        const morning = data.filter((d) => String(d.category_id) === String(mId));
        const evening = data.filter((d) => String(d.category_id) === String(eId));

        setMorningAdkar(morning);
        setEveningAdkar(evening);

        if (morning.length > 0) {
          setIsMorningLiked(morning[0].is_favorite || false);
          setMorningFavoriteCount(morning[0].favorite_count || 0);
        }
        if (evening.length > 0) {
          setIsEveningLiked(evening[0].is_favorite || false);
          setEveningFavoriteCount(evening[0].favorite_count || 0);
        }
      }

      // 3. Fetch Segments using correct IDs
      setMorningSegments(await fetchSegmentsData(mId));
      setEveningSegments(await fetchSegmentsData(eId));

    } catch (err) {
      console.error("Failed to fetch adkar data", err);
    }
  }, [fetchSegmentsData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetAudioState = (isMorning) => {
    setAudioError(false);
    const audioRef = isMorning ? morningAudioRef : eveningAudioRef;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (isMorning) {
      setIsPlayingMorning(false);
      setMorningProgress(0);
      setHighlightedMorningSegmentIndex(-1);
    } else {
      setIsPlayingEvening(false);
      setEveningProgress(0);
      setHighlightedEveningSegmentIndex(-1);
    }
  };

  const togglePlayPause = (type) => {
    const isMorning = type === "morning";
    const audioRef = isMorning ? morningAudioRef : eveningAudioRef;
    const otherRef = isMorning ? eveningAudioRef : morningAudioRef;
    const playing = isMorning ? isPlayingMorning : isPlayingEvening;
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      isMorning ? setIsPlayingMorning(false) : setIsPlayingEvening(false);
    } else {
      if (otherRef.current) otherRef.current.pause();
      isMorning
        ? (setIsPlayingMorning(true), setIsPlayingEvening(false))
        : (setIsPlayingEvening(true), setIsPlayingMorning(false));
      audioRef.current
        .play()
        .catch(() =>
          isMorning ? setIsPlayingMorning(false) : setIsPlayingEvening(false)
        );
    }
  };

  const handleAudioEnded = (isMorning) => {
    const audioRef = isMorning ? morningAudioRef : eveningAudioRef;
    if (repeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => { });
      }
    } else {
      resetAudioState(isMorning);
    }
  };

  const handleTimeUpdate = useCallback(
    (e, isMorning) => {
      const audio = e.target;
      const currentTime = audio.currentTime;
      const segments = isMorning ? morningSegments : eveningSegments;
      const setHighlighted = isMorning
        ? setHighlightedMorningSegmentIndex
        : setHighlightedEveningSegmentIndex;
      const highlightedIndex = isMorning
        ? highlightedMorningSegmentIndex
        : highlightedEveningSegmentIndex;
      isMorning
        ? setMorningProgress(currentTime)
        : setEveningProgress(currentTime);
      if (!segments.length) return setHighlighted(-1);
      let newIndex = -1;
      for (let i = 0; i < segments.length; i++) {
        const start = Number(segments[i].start_time);
        const end = Number(segments[i].end_time);
        if (currentTime >= start && currentTime < end) {
          newIndex = i;
          break;
        }
      }
      if (newIndex !== highlightedIndex) setHighlighted(newIndex);
    },
    [
      morningSegments,
      eveningSegments,
      highlightedMorningSegmentIndex,
      highlightedEveningSegmentIndex,
    ]
  );

  const scrollToSegment = (isMorning, index) => {
    const refs = isMorning
      ? morningSegmentRefs.current
      : eveningSegmentRefs.current;
    const el = refs[index];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useEffect(() => {
    if (highlightedMorningSegmentIndex !== -1)
      scrollToSegment(true, highlightedMorningSegmentIndex);
  }, [highlightedMorningSegmentIndex]);
  useEffect(() => {
    if (highlightedEveningSegmentIndex !== -1)
      scrollToSegment(false, highlightedEveningSegmentIndex);
  }, [highlightedEveningSegmentIndex]);

  const renderArabicWithHighlight = (dua, isMorning) => {
    const segments = isMorning ? morningSegments : eveningSegments;
    const highlightedSegmentIndex = isMorning
      ? highlightedMorningSegmentIndex
      : highlightedEveningSegmentIndex;
    const refs = isMorning ? morningSegmentRefs : eveningSegmentRefs;
    const firstGlobalIndex = segments.findIndex((s) => s.dua_id === dua.id);
    if (firstGlobalIndex === -1) {
      return <span className="text-gray-800">{dua.arabic}</span>;
    }
    return (
      <div className="text-right font-serif-arabic text-xl sm:text-2xl leading-loose rounded transition-colors duration-300 text-gray-900">
        {segments
          .filter((s) => s.dua_id === dua.id)
          .map((segment, i) => {
            const globalIndex = firstGlobalIndex + i;
            const isCurrent = globalIndex === highlightedSegmentIndex;
            return (
              <span
                key={`${dua.id}-${i}-${isCurrent}`}
                ref={(el) => (refs.current[globalIndex] = el)}
                className={`transition-all duration-200 px-1 rounded ${isCurrent
                    ? "bg-emerald-300 text-emerald-900 font-extrabold"
                    : "bg-transparent text-gray-900"
                  }`}
              >
                {segment.text}
              </span>
            );
          })}
      </div>
    );
  };

  const handleCategoryClick = (categoryId) => {
    window.location.href = `/duas?category=${categoryId}`;
  };

  const handleViewAllDuasClick = () => {
    window.location.href = `/duas`;
  };

  const toggleFavorite = async (type) => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = LOGIN_URL;
      return;
    }

    const isMorning = type === "morning";
    const adkarList = isMorning ? morningAdkar : eveningAdkar;

    const primaryDuaId = adkarList.length > 0 ? adkarList[0].id : null;
    if (!primaryDuaId) return;

    try {
      await apiService.toggleDuaFavorite(primaryDuaId, token);

      // OPTIMIZED: Re-fetch the full adkar list to ensure the is_favorite state is current
      await fetchAdkar();
    } catch (error) {
      if (error.message === "No token") {
        localStorage.removeItem("token");
        window.location.href = LOGIN_URL;
        return;
      }
      console.error("Error toggling favorite:", error);
    }
  };

  const handleShare = (type, adkarTitle, duaId) => {
    const shareUrl = `${FRONTEND_BASE_URL}/duas?duaId=${duaId}`;

    const shareTitle = `${adkarTitle} | Daily Remembrance`;
    const shareText = `Share this Dua for the sake of Allah (swt): ${shareUrl}`;

    if (navigator.share) {
      navigator
        .share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
        .then(() => console.log("Successfully shared"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      prompt(
        "Share this Dua for the sake of Allah (swt). Copy the link below:",
        shareUrl
      );
    }
  };

  const renderAdkarCard = (adkar, type, Icon) => {
    const userIsLoggedIn = isUserLoggedIn();

    const isMorning = type === "morning";
    const isPlaying = isMorning ? isPlayingMorning : isPlayingEvening;
    const progress = isMorning ? morningProgress : eveningProgress;
    const duration = isMorning ? morningDuration : eveningDuration;
    const audioRef = isMorning ? morningAudioRef : eveningAudioRef;
    const listRef = isMorning ? morningListRef : eveningListRef;
    const duaRefs = isMorning ? morningDuaRefs : eveningDuaRefs;
    const highlightedDuaId = isMorning
      ? morningSegments[highlightedMorningSegmentIndex]?.dua_id
      : eveningSegments[highlightedEveningSegmentIndex]?.dua_id;
    const highlightedDuaIndex = adkar.findIndex(
      (dua) => dua.id === highlightedDuaId
    );

    const primaryAdkar = adkar[0] || {};
    const adkarTitle = isMorning ? "Morning Adhkar" : "Evening Adhkar";

    const isLiked = isMorning ? isMorningLiked : isEveningLiked;
    const favoriteCount = isMorning
      ? morningFavoriteCount
      : eveningFavoriteCount;

    if (!adkar.length)
      return (
        <div className="rounded-3xl p-6 flex flex-col items-center justify-center h-full">
          <p className="text-gray-500">Loading {type} Adkar...</p>
        </div>
      );

    const fullAudioSource = primaryAdkar;
    let localAudioPath =
      fullAudioSource.audio_path ||
      (isMorning
        ? "/static/audio/category_5_Morning_Dua.mp3"
        : "/static/audio/category_6_Evening_Dua.mp3");
    if (localAudioPath && localAudioPath.startsWith("/"))
      localAudioPath = STATIC_BASE_URL + localAudioPath;

    duaRefs.current = [];
    const setDuaRef = (el, index) => {
      if (el) duaRefs.current[index] = el;
    };

    const shareButtonTitle = `Share for the sake of Allah (swt)`;

    return (
      <div className="rounded-3xl shadow-xl bg-white transition-all flex flex-col justify-between h-full overflow-hidden border border-gray-100">
        <div>
          <div className="flex items-start justify-between mb-0 border-b border-gray-100 pb-4 pt-6 px-6 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-full shadow-md ${isMorning ? "bg-amber-500" : "bg-indigo-600"
                  }`}
              >
                <Icon className={`w-7 h-7 text-white`} />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 capitalize">
                {adkarTitle}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleShare(type, adkarTitle, primaryAdkar.id)}
                className="p-2 rounded-full text-gray-500 hover:text-emerald-600 hover:bg-emerald-100 transition duration-150 group"
                title={shareButtonTitle}
              >
                <div className="flex items-center gap-1">
                  <Share2 className="w-5 h-5" />
                  <span className="hidden md:inline text-sm font-semibold text-gray-700 group-hover:text-emerald-700">
                    Share for Allah's sake
                  </span>
                </div>
              </button>
              <button
                onClick={() => toggleFavorite(type)}
                className={`p-2 rounded-full transition duration-150 flex items-center gap-1 ${isLiked
                    ? "text-red-500 hover:text-red-600 bg-red-100"
                    : "text-gray-500 hover:text-red-500 hover:bg-gray-100"
                  }`}
                title={
                  userIsLoggedIn ? "Toggle Favorite" : "Log in to favorite"
                }
              >
                <Heart
                  className={`w-5 h-5 ${isLiked ? "fill-red-500" : "fill-none"
                    }`}
                />
                <span className="text-sm font-semibold">{favoriteCount}</span>
              </button>
            </div>
          </div>

          <div
            ref={listRef}
            className="rounded-lg p-4 mb-0 min-h-[300px] max-h-[450px] overflow-y-scroll scroll-smooth"
          >
            {adkar.map((dua, index) => (
              <div
                key={dua.id}
                ref={(el) => setDuaRef(el, index)}
                className={`p-5 rounded-xl transition-all duration-300 mb-4 shadow-sm border-2 ${index === highlightedDuaIndex
                    ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-400"
                    : "bg-white border-gray-100 hover:border-emerald-200"
                  }`}
              >
                {dua.title && (
                  <h4 className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    {dua.title}
                  </h4>
                )}
                <div
                  key={`${dua.id}-${isMorning
                      ? highlightedMorningSegmentIndex
                      : highlightedEveningSegmentIndex
                    }`}
                  className="text-right font-serif-arabic text-xl leading-loose rounded transition-colors duration-300 text-gray-900"
                >
                  {renderArabicWithHighlight(dua, isMorning)}
                </div>
                {dua.transliteration && (
                  <p className="text-sm text-gray-700 mt-3 italic">
                    {dua.transliteration}
                  </p>
                )}
                {dua.translation && (
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {dua.translation}
                  </p>
                )}

                {(dua.benefits || dua.notes) && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    {dua.benefits && (
                      <div className="mb-2">
                        <h5 className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          Benefit:
                        </h5>
                        <p className="text-xs text-gray-600 italic mt-1">
                          {dua.benefits}
                        </p>
                      </div>
                    )}
                    {dua.notes && (
                      <div>
                        <h5 className="text-xs font-bold text-gray-700 flex items-center gap-1">
                          <BookOpenCheck className="w-3 h-3 text-gray-500 flex-shrink-0" />
                          Note:
                        </h5>
                        <p className="text-xs text-gray-600 mt-1">
                          {dua.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {audioError ? (
          <p className="text-red-500 text-sm mb-2 px-4">
            Audio failed to load. Check server static files at: {localAudioPath}
          </p>
        ) : (
          <audio
            ref={audioRef}
            key={`full-adkar-${isMorning ? "m" : "e"}`}
            src={localAudioPath}
            preload="metadata"
            onLoadedMetadata={(e) => {
              const audio = e.target;
              isMorning
                ? setMorningDuration(audio.duration)
                : setEveningDuration(audio.duration);
              setAudioError(false);
            }}
            onTimeUpdate={(e) => handleTimeUpdate(e, isMorning)}
            onEnded={() => handleAudioEnded(isMorning)}
            onError={() => setAudioError(true)}
          />
        )}
        <div className="p-5 mt-auto bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-600 mb-2 font-semibold">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={progress}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (audioRef.current) audioRef.current.currentTime = val;
              isMorning ? setMorningProgress(val) : setEveningProgress(val);
            }}
            className="w-full accent-emerald-600 cursor-pointer h-2"
          />
          <div className="flex justify-center items-center mt-4 gap-3">
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play().catch(() => { });
                  isMorning
                    ? setIsPlayingMorning(true)
                    : setIsPlayingEvening(true);
                }
              }}
              className="p-3 rounded-full bg-gray-300 hover:bg-gray-400 transition shadow-md"
            >
              <RotateCcw className="w-5 h-5 text-gray-800" />
            </button>
            <button
              onClick={() => togglePlayPause(type)}
              className={`p-5 rounded-full shadow-xl transition-all transform hover:scale-105 ${isPlaying
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600"
                } text-white`}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 fill-current" />
              )}
            </button>
            <button
              onClick={() => setRepeat((p) => !p)}
              className={`p-3 rounded-full transition shadow-md ${repeat
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-gray-300 hover:bg-gray-400"
                }`}
            >
              <Repeat
                className={`w-5 h-5 ${repeat ? "text-white" : "text-gray-800"}`}
              />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50 py-12 px-4 min-h-screen">
      <style>{`
        .font-serif-arabic { font-family: "Amiri", "Traditional Arabic", "Scheherazade", serif; }
        .overflow-y-scroll::-webkit-scrollbar { width: 8px; }
        .overflow-y-scroll::-webkit-scrollbar-thumb { background-color: #10b981; border-radius: 4px; }
        .overflow-y-scroll::-webkit-scrollbar-thumb:hover { background-color: #059669; }
        .overflow-y-scroll::-webkit-scrollbar-track { background-color: #f3f4f6; }
        .horizontal-scroll::-webkit-scrollbar { height: 8px; }
        .horizontal-scroll::-webkit-scrollbar-thumb { background-color: #10b981; border-radius: 4px; }
        .horizontal-scroll::-webkit-scrollbar-thumb:hover { background-color: #059669; }
        .horizontal-scroll::-webkit-scrollbar-track { background-color: #f3f4f6; }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Daily Remembrance
            </span>
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto font-light">
            Begin and end each day with tranquility and spiritual blessings
            through guided remembrance.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {renderAdkarCard(morningAdkar, "morning", Sun)}
          {renderAdkarCard(eveningAdkar, "evening", Moon)}
        </div>

        <div className="mt-16">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-3">
              Explore More{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Duas & Adhkar
              </span>
            </h3>
            <p className="text-gray-600 text-base max-w-xl mx-auto">
              Discover beautiful supplications for every moment of your life
            </p>
          </div>

          <div
            className="flex space-x-6 overflow-x-scroll horizontal-scroll pb-4"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {categories.map((category) => {
              const imageUrl = getFullImageUrl(category.image_url);
              return (
                <div
                  key={category.id}
                  className="flex-none w-48 group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="relative h-32 bg-gradient-to-br from-emerald-100 to-teal-100 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpenCheck className="w-12 h-12 text-emerald-500" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-bold text-gray-800 text-center group-hover:text-emerald-600 transition-colors mb-3 line-clamp-2">
                      {category.name}
                    </h4>
                    <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold py-2 px-3 rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-1 shadow-md">
                      View
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleViewAllDuasClick}
              className="inline-flex items-center text-lg font-semibold text-emerald-600 hover:text-emerald-700 transition-colors py-2 px-4 rounded-full border border-emerald-300 hover:bg-emerald-50"
            >
              View All Duas
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

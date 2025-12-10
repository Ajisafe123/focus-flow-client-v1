import React, { useState, useRef, useEffect } from "react";
import {
  Edit,
  Trash2,
  Star,
  Eye,
  Heart,
  Tag,
  MoreVertical,
  Play,
  Pause,
  RotateCcw,
  Repeat,
  ChevronLeft,
  ChevronRight,
  Volume2,
  BookOpen,
} from "lucide-react";

const AudioPlayer = ({ audioPath, API_BASE }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [repeatMode, setRepeatMode] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setIsLoading(true);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
    }
  }, [audioPath]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = repeatMode;
    }
  }, [repeatMode]);

  const handleLoadMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    if (!repeatMode) {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current && !isLoading) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((error) => console.error("Playback failed:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === Infinity || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!audioPath) return null;

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setCurrentTime(val);
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-3 sm:p-4">
      <audio
        ref={audioRef}
        src={`${API_BASE}${audioPath}`}
        onLoadedMetadata={handleLoadMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        <Volume2 className="w-4 h-4 text-white flex-shrink-0" />
        <span className="text-xs font-semibold text-white">
          Audio Recitation
        </span>
      </div>

      <div className="mb-3">
        <div className="relative h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSliderChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>
        <div className="flex justify-between text-xs text-white/80 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={handleRewind}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-white" />
        </button>

        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className={`p-3 rounded-full transition-all disabled:opacity-50 ${
            isPlaying
              ? "bg-red-500 hover:bg-red-600"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-emerald-600 fill-current ml-0.5" />
          )}
        </button>

        <button
          onClick={() => setRepeatMode((prev) => !prev)}
          className={`p-2 rounded-full transition-all ${
            repeatMode
              ? "bg-white text-emerald-600"
              : "bg-white/20 hover:bg-white/30 text-white"
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

const DuasList = ({
  currentDua,
  currentDuaListLength,
  currentDuaIndex,
  goToNextDua,
  goToPrevDua,
  selectedCategoryName,
  openEditModal,
  toggleFeatured,
  confirmDelete,
  getCategoryName,
  openDropdownId,
  setOpenDropdownId,
  API_BASE,
}) => {
  const [touchStart, setTouchStart] = useState(null);

  const onTouchStart = (e) => {
    if (e.targetTouches.length === 1) {
      setTouchStart(e.targetTouches[0].clientX);
    }
  };

  const onTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;

    if (distance > 50) goToNextDua();
    else if (distance < -50) goToPrevDua();
    setTouchStart(null);
  };

  if (currentDuaListLength === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
          <span className="text-3xl">🤲</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No Duas Found</h3>
        <p className="text-sm text-gray-600">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  const dua = currentDua;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Dua {currentDuaIndex + 1} of {currentDuaListLength}
              </h3>
              {selectedCategoryName && (
                <p className="text-xs text-gray-600 mt-0.5">
                  {selectedCategoryName}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:flex items-center gap-1 text-gray-600">
              <Eye className="w-4 h-4" />
              {(dua.view_count || 0).toLocaleString()}
            </span>
            <span className="hidden sm:flex items-center gap-1 text-red-600">
              <Heart className="w-4 h-4 fill-red-400" />
              {(dua.favorite_count || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {dua.featured && (
          <div className="bg-gradient-to-r from-amber-400 to-yellow-400 px-4 py-2 flex items-center justify-center gap-2 text-amber-900 text-xs font-bold">
            <Star className="w-4 h-4 fill-current" />
            Featured Dua
          </div>
        )}

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {dua.title || "Untitled Dua"}
            </h2>

            <div className="relative flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdownId(openDropdownId === dua.id ? null : dua.id);
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {openDropdownId === dua.id && (
                <div
                  className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      openEditModal(dua);
                      setOpenDropdownId(null);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Edit className="w-4 h-4 text-emerald-600" />
                    Edit Dua
                  </button>
                  <button
                    onClick={() => {
                      toggleFeatured(dua.id, dua.featured);
                      setOpenDropdownId(null);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        dua.featured ? "fill-amber-500 text-amber-500" : ""
                      }`}
                    />
                    {dua.featured ? "Unmark Featured" : "Mark Featured"}
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      confirmDelete(dua);
                      setOpenDropdownId(null);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Dua
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mb-3 p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
            <p
              dir="rtl"
              className="text-xl sm:text-2xl text-right text-gray-900 leading-relaxed"
              style={{
                fontFamily:
                  "'Amiri', 'Scheherazade New', 'Traditional Arabic', serif",
                fontWeight: "700",
              }}
            >
              {dua.arabic || "لا يوجد نص عربي"}
            </p>
          </div>
          {dua.transliteration && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-bold text-blue-800 uppercase mb-1">
                Transliteration
              </p>
              <p className="text-sm text-blue-900 italic">
                {dua.transliteration}
              </p>
            </div>
          )}
          {dua.translation && (
            <p className="text-sm sm:text-base text-gray-900 font-medium mb-3 leading-relaxed">
              "{dua.translation}"
            </p>
          )}
          {dua.benefits && (
            <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs font-bold text-green-800 flex items-center gap-1 mb-1">
                <Star className="w-3.5 h-3.5 fill-green-600 text-green-600" />
                Benefits
              </p>
              <p className="text-sm text-green-700">{dua.benefits}</p>
            </div>
          )}

          {(dua.notes || dua.source) && (
            <div className="space-y-2 mb-3">
              {dua.notes && (
                <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <span className="font-semibold">Notes:</span> {dua.notes}
                </p>
              )}
              {dua.source && (
                <p className="text-xs sm:text-sm text-gray-600">
                  <span className="font-semibold">Source:</span> {dua.source}
                </p>
              )}
            </div>
          )}
          {dua.audio_path && (
            <div className="mb-3">
              <AudioPlayer audioPath={dua.audio_path} API_BASE={API_BASE} />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-semibold text-xs flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {getCategoryName(dua.category_id)}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-600 sm:hidden">
              <Eye className="w-3.5 h-3.5" />
              {(dua.view_count || 0).toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-xs text-red-600 sm:hidden">
              <Heart className="w-3.5 h-3.5 fill-red-400" />
              {(dua.favorite_count || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={goToPrevDua}
            disabled={currentDuaListLength === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 font-medium text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          <div className="px-4 py-1.5 text-black rounded-full font-bold text-sm">
            {currentDuaIndex + 1} / {currentDuaListLength}
          </div>

          <button
            onClick={goToNextDua}
            disabled={currentDuaListLength === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 font-medium text-sm"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuasList;
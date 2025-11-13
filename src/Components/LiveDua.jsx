import React, { useState, useEffect, useRef, useCallback } from "react";
import { Sun, Moon, Play, Pause, Repeat, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LiveDua() {
  const [morningAdkar, setMorningAdkar] = useState([]);
  const [eveningAdkar, setEveningAdkar] = useState([]);
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
  const morningAudioRef = useRef(null);
  const eveningAudioRef = useRef(null);
  const morningListRef = useRef(null);
  const eveningListRef = useRef(null);
  const morningDuaRefs = useRef([]);
  const eveningDuaRefs = useRef([]);
  const morningSegmentRefs = useRef({});
  const eveningSegmentRefs = useRef({});
  const navigate = useNavigate();
  const API_BASE_URL = "https://focus-flow-server-v1.onrender.com/api";
  const STATIC_BASE_URL = "https://focus-flow-server-v1.onrender.com";

  const formatTime = (t) =>
    !t || isNaN(t)
      ? "00:00"
      : `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(
          Math.floor(t % 60)
        ).padStart(2, "0")}`;

  const fetchSegmentsData = useCallback(
    async (categoryId) => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/categories/${categoryId}/full-segments`
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data.arabic_segments || [];
      } catch {
        return [];
      }
    },
    [API_BASE_URL]
  );

  const fetchAdkar = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/duas`);
      const data = await res.json();
      const morning = data.filter((d) => d.category_id === 5);
      const evening = data.filter((d) => d.category_id === 6);
      setMorningAdkar(morning);
      setEveningAdkar(evening);
      setMorningSegments(await fetchSegmentsData(5));
      setEveningSegments(await fetchSegmentsData(6));
    } catch {}
  }, [API_BASE_URL, fetchSegmentsData]);

  useEffect(() => {
    fetchAdkar();
  }, [fetchAdkar]);

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
        audioRef.current.play().catch(() => {});
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
                className={`transition-all duration-200 px-1 rounded ${
                  isCurrent
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

  const renderAdkarCard = (adkar, type, Icon) => {
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
    if (!adkar.length)
      return (
        <div className="rounded-3xl p-6 flex flex-col items-center justify-center h-full">
          <p className="text-gray-500">Loading {type} Adkar...</p>
        </div>
      );
    const fullAudioSource = adkar[0];
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
    return (
      <div className="rounded-3xl p-0 transition-all flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3 p-6 bg-white rounded-t-3xl shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-full ${
                  isMorning ? "bg-amber-100" : "bg-indigo-100"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isMorning ? "text-amber-600" : "text-indigo-600"
                  }`}
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 capitalize">
                {type} Adkar List
              </h3>
            </div>
          </div>
          <div
            ref={listRef}
            className="rounded-lg p-0 mb-3 min-h-[300px] max-h-[500px] overflow-y-scroll scroll-smooth"
          >
            {adkar.map((dua, index) => (
              <div
                key={dua.id}
                ref={(el) => setDuaRef(el, index)}
                className={`p-4 rounded-lg transition-all duration-300 mb-4 shadow-sm bg-white border border-gray-100 ${
                  index === highlightedDuaIndex
                    ? "bg-emerald-50 border-emerald-300"
                    : "hover:bg-gray-50"
                }`}
              >
                {dua.title && (
                  <h4 className="text-sm font-semibold text-emerald-700 mb-2">
                    {index + 1}. {dua.title}
                  </h4>
                )}
                <div
                  key={`${dua.id}-${
                    isMorning
                      ? highlightedMorningSegmentIndex
                      : highlightedEveningSegmentIndex
                  }`}
                  className="text-right font-serif-arabic text-xl leading-loose rounded transition-colors duration-300 text-gray-900"
                >
                  {renderArabicWithHighlight(dua, isMorning)}
                </div>
                {dua.transliteration && (
                  <p className="text-sm text-gray-700 mt-2">
                    {dua.transliteration}
                  </p>
                )}
                {dua.translation && (
                  <p className="text-xs text-gray-600 mt-2">
                    {dua.translation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        {audioError ? (
          <p className="text-red-500 text-sm mb-2">
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
        <div className="p-4 mt-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
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
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-center items-center mt-3 gap-4">
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play().catch(() => {});
                  isMorning
                    ? setIsPlayingMorning(true)
                    : setIsPlayingEvening(true);
                }
              }}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <RotateCcw className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => togglePlayPause(type)}
              className={`p-4 rounded-full shadow-lg transition ${
                isPlaying
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-emerald-600 hover:bg-emerald-700"
              } text-white`}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}
            </button>
            <button
              onClick={() => setRepeat((p) => !p)}
              className={`p-2 rounded-full ${
                repeat ? "bg-emerald-500" : "bg-gray-200"
              } hover:bg-gray-300`}
            >
              <Repeat
                className={`w-5 h-5 ${repeat ? "text-white" : "text-gray-700"}`}
              />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white py-10 px-4 min-h-screen">
      <style>{`
        .font-serif-arabic { font-family: "Amiri", "Traditional Arabic", "Scheherazade", serif; }
        .overflow-y-scroll::-webkit-scrollbar { width: 6px; }
        .overflow-y-scroll::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 3px; }
        .overflow-y-scroll::-webkit-scrollbar-thumb:hover { background-color: #9ca3af; }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            Your <span className="text-emerald-600">Daily Remembrance</span>
          </h2>
          <p className="text-gray-600 text-base max-w-xl mx-auto">
            Begin and end each day with tranquility and spiritual blessings.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {renderAdkarCard(morningAdkar, "morning", Sun)}
          {renderAdkarCard(eveningAdkar, "evening", Moon)}
        </div>
      </div>
    </div>
  );
}

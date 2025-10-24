import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  ChevronDown,
  Play,
  Pause,
  Repeat,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdkarDuaSection() {
  const [morningAdkar, setMorningAdkar] = useState([]);
  const [eveningAdkar, setEveningAdkar] = useState([]);
  const [currentMorningIndex, setCurrentMorningIndex] = useState(0);
  const [currentEveningIndex, setCurrentEveningIndex] = useState(0);
  const [isPlayingMorning, setIsPlayingMorning] = useState(false);
  const [isPlayingEvening, setIsPlayingEvening] = useState(false);
  const [morningProgress, setMorningProgress] = useState(0);
  const [eveningProgress, setEveningProgress] = useState(0);
  const [morningDuration, setMorningDuration] = useState(0);
  const [eveningDuration, setEveningDuration] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const morningAudioRef = useRef(null);
  const eveningAudioRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAdkar();
  }, []);

  useEffect(() => {
    const setupAudio = (audioRef, setProgress, setDuration, setPlaying) => {
      const audio = audioRef.current;
      if (!audio) return;

      const onTimeUpdate = () => setProgress(audio.currentTime);
      const onLoadedMetadata = () => setDuration(audio.duration || 0);
      const onEnded = () => {
        if (repeat) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        } else setPlaying(false);
      };
      const onError = () => setAudioError(true);

      audio.addEventListener("timeupdate", onTimeUpdate);
      audio.addEventListener("loadedmetadata", onLoadedMetadata);
      audio.addEventListener("ended", onEnded);
      audio.addEventListener("error", onError);

      return () => {
        audio.removeEventListener("timeupdate", onTimeUpdate);
        audio.removeEventListener("loadedmetadata", onLoadedMetadata);
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("error", onError);
      };
    };

    const cleanupMorning = setupAudio(
      morningAudioRef,
      setMorningProgress,
      setMorningDuration,
      setIsPlayingMorning
    );
    const cleanupEvening = setupAudio(
      eveningAudioRef,
      setEveningProgress,
      setEveningDuration,
      setIsPlayingEvening
    );

    return () => {
      cleanupMorning?.();
      cleanupEvening?.();
    };
  }, [repeat]);

  const togglePlayPause = (type) => {
    const isMorning = type === "morning";
    const audioRef = isMorning ? morningAudioRef : eveningAudioRef;
    const otherRef = isMorning ? eveningAudioRef : morningAudioRef;
    const playing = isMorning ? isPlayingMorning : isPlayingEvening;

    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play blocked:", err));
      if (otherRef.current) otherRef.current.pause();
    }

    if (isMorning) {
      setIsPlayingMorning(!playing);
      setIsPlayingEvening(false);
    } else {
      setIsPlayingEvening(!playing);
      setIsPlayingMorning(false);
    }
  };

  const formatTime = (t) =>
    !t || isNaN(t)
      ? "00:00"
      : `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(
          Math.floor(t % 60)
        ).padStart(2, "0")}`;

  const fetchAdkar = async () => {
    try {
      const res = await fetch(
        "https://focus-flow-server-v1.onrender.com/duas/"
      );
      const data = await res.json();
      setMorningAdkar(data.filter((d) => d.category === "morning-dhikr"));
      setEveningAdkar(data.filter((d) => d.category === "evening-dhikr"));
    } catch (err) {
      console.error("Could not fetch Adkar", err);
    }
  };

  const handleNext = (type) => {
    const isMorning = type === "morning";
    const adkar = isMorning ? morningAdkar : eveningAdkar;
    const setIndex = isMorning
      ? setCurrentMorningIndex
      : setCurrentEveningIndex;
    setIndex((i) => (i + 1) % adkar.length);
    if (isMorning) {
      morningAudioRef.current.pause();
      setIsPlayingMorning(false);
      setMorningProgress(0);
    } else {
      eveningAudioRef.current.pause();
      setIsPlayingEvening(false);
      setEveningProgress(0);
    }
  };

  const handlePrev = (type) => {
    const isMorning = type === "morning";
    const adkar = isMorning ? morningAdkar : eveningAdkar;
    const setIndex = isMorning
      ? setCurrentMorningIndex
      : setCurrentEveningIndex;
    setIndex((i) => (i - 1 + adkar.length) % adkar.length);
    if (isMorning) {
      morningAudioRef.current.pause();
      setIsPlayingMorning(false);
      setMorningProgress(0);
    } else {
      eveningAudioRef.current.pause();
      setIsPlayingEvening(false);
      setEveningProgress(0);
    }
  };

  const renderAdkarCard = (adkar, currentIndex, type, Icon) => {
    if (!adkar.length) return null;
    const current = adkar[currentIndex];
    const isMorning = type === "morning";
    const isPlaying = isMorning ? isPlayingMorning : isPlayingEvening;
    const progress = isMorning ? morningProgress : eveningProgress;
    const duration = isMorning ? morningDuration : eveningDuration;
    const audioRef = isMorning ? morningAudioRef : eveningAudioRef;

    return (
      <div className="bg-white rounded-3xl shadow-md sm:shadow-lg p-6 sm:p-7 hover:shadow-xl transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
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
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 capitalize">
                {type} Adkar
              </h3>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold flex items-center gap-1"
            >
              <span className="sm:inline">View Full</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-3">
            {current.title && (
              <h4 className="text-lg font-semibold text-emerald-700 mb-2">
                {current.title}
              </h4>
            )}
            <div className="text-right font-serif-arabic text-xl sm:text-2xl text-gray-900 leading-loose mb-3">
              {current.arabic}
            </div>
            {current.latin && (
              <p className="italic text-sm text-gray-700 mb-2">
                {current.latin}
              </p>
            )}
            {current.translation && (
              <p className="text-sm text-gray-800 mb-2">
                {current.translation}
              </p>
            )}
            {current.notes && (
              <p className="text-xs text-gray-600 mb-2">
                <span className="font-semibold">Notes: </span>
                {current.notes}
              </p>
            )}
            {current.benefits && (
              <p className="text-xs text-gray-600 mb-2">
                <span className="font-semibold">Benefits: </span>
                {current.benefits}
              </p>
            )}
            {current.source && (
              <p className="text-xs text-gray-500 italic">{current.source}</p>
            )}
          </div>
        </div>

        {audioError ? (
          <p className="text-red-500 text-sm mb-2">Audio failed to load.</p>
        ) : (
          <audio
            ref={audioRef}
            src={
              current.audio_url ||
              `https://focus-flow-server-v1.onrender.com/static/audio/${type}_dua.mp3`
            }
            preload="metadata"
            onLoadedMetadata={(e) => {
              const audio = e.target;
              isMorning
                ? setMorningDuration(audio.duration)
                : setEveningDuration(audio.duration);
            }}
            onTimeUpdate={(e) => {
              const audio = e.target;
              isMorning
                ? setMorningProgress(audio.currentTime)
                : setEveningProgress(audio.currentTime);
            }}
            onEnded={() => {
              if (repeat) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => {});
              } else {
                isMorning
                  ? setIsPlayingMorning(false)
                  : setIsPlayingEvening(false);
              }
            }}
            onError={() => setAudioError(true)}
          />
        )}

        <div className="bg-gray-100 rounded-xl p-4 sm:p-5">
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
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

          <div className="flex justify-center items-center mt-3 gap-4 sm:gap-6">
            <button
              onClick={() => handlePrev(type)}
              className="sm:flex p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play();
                  isMorning
                    ? setIsPlayingMorning(true)
                    : setIsPlayingEvening(true);
                }
              }}
              className="sm:flex p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <RotateCcw className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={() => togglePlayPause(type)}
              className={`p-4 sm:p-5 rounded-full shadow-lg transition ${
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
              onClick={() => handleNext(type)}
              className="sm:flex p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={() => setRepeat((prev) => !prev)}
              className={`sm:flex p-2 rounded-full ${
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
    <div className="bg-white py-10 sm:py-16 px-4 min-h-screen">
      <style>{`
        .font-serif-arabic {
          font-family: "Amiri", "Traditional Arabic", "Scheherazade", serif;
        }
        input[type="range"]::-webkit-slider-thumb {
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: #059669;
          cursor: pointer;
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="header-text text-3xl sm:text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
            Your <span className="text-emerald-600">Daily Remembrance</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
            Begin and end each day with tranquility and spiritual blessings.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {renderAdkarCard(morningAdkar, currentMorningIndex, "morning", Sun)}
          {renderAdkarCard(eveningAdkar, currentEveningIndex, "evening", Moon)}
        </div>
      </div>
    </div>
  );
}

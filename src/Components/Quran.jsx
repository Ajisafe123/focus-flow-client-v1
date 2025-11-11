import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Play,
  Pause,
  Bookmark,
  BookmarkCheck,
  ListOrdered,
  X,
} from "lucide-react";
import SurahList from "./SurahList";

const API_BASE_URL = "https://focus-flow-server-v1.onrender.com";

const QuranWord = ({ word, currentWordIndex }) => {
  const isHighlighted = word.word_id === currentWordIndex;

  return (
    <span
      data-word-id={word.word_id}
      data-start-time={word.timing?.start}
      data-end-time={word.timing?.end}
      style={{ fontFamily: "Amiri, serif" }}
      className={`
        inline-block
        text-right
        text-4xl 
        leading-[2.5]  
        text-gray-800 
        rtl
        mx-1
        ${
          isHighlighted
            ? "text-green-600 font-bold transition-colors duration-100"
            : ""
        }
      `}
    >
      {word.text_qpc_hafs}
    </span>
  );
};

const QuranVerse = ({
  verse,
  toggleBookmark,
  currentAudioTime,
  currentVerseKey,
  onPlayClicked,
}) => {
  const isBookmarked = verse.bookmarked;
  const canBookmark = "bookmarked" in verse && toggleBookmark;
  const isCurrentVerse = verse.verse_key === currentVerseKey;
  const surahNumber = parseInt(verse.verse_key.split(":")[0]);

  const bookmarkIcon = isBookmarked ? BookmarkCheck : Bookmark;
  const bookmarkColor = isBookmarked
    ? "text-green-600"
    : canBookmark
    ? "text-gray-400 hover:text-green-500"
    : "text-gray-300 cursor-default";

  const handleToggle = () => {
    if (canBookmark) {
      toggleBookmark(verse.verse_key);
    } else {
      alert("Please log in to save bookmarks.");
    }
  };

  const tafsirList = Array.isArray(verse.tafsir) ? verse.tafsir : [];

  let currentWordIndex = null;
  if (isCurrentVerse && surahNumber !== 1 && verse.words) {
    for (const word of verse.words) {
      if (
        word.timing &&
        currentAudioTime >= word.timing.start &&
        currentAudioTime < word.timing.end
      ) {
        currentWordIndex = word.word_id;
        break;
      }
    }
  }

  const renderArabicText = () => {
    if (
      surahNumber !== 1 &&
      verse.words &&
      verse.words.length > 0 &&
      verse.words[0].timing
    ) {
      return verse.words.map((word) => (
        <QuranWord
          key={word.id}
          word={word}
          currentWordIndex={currentWordIndex}
        />
      ));
    }
    return (
      <span
        className="text-right text-4xl leading-[2.5] text-gray-800 rtl mx-1"
        style={{ fontFamily: "Amiri, serif" }}
      >
        {verse.text_qpc_hafs}
      </span>
    );
  };

  return (
    <div className="py-4 px-4 sm:px-6 md:px-8 border-b border-green-100/50 hover:bg-green-50/50 transition duration-150">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-4 text-sm font-medium text-green-700">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-800 border-2 border-green-300">
            {verse.verse_key.split(":")[1]}
          </span>
          <button
            className={`transition ${
              isCurrentVerse
                ? "text-green-700"
                : "text-green-500 hover:text-green-700"
            }`}
            title="Play Recitation"
            onClick={() => onPlayClicked(verse.verse_key)}
          >
            <Play size={20} />
          </button>
          <button
            onClick={handleToggle}
            className={`transition duration-150 ${bookmarkColor}`}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Verse"}
            disabled={!canBookmark}
          >
            {React.createElement(bookmarkIcon, { size: 18 })}
          </button>
        </div>
      </div>

      <div className="rtl mb-4">{renderArabicText()}</div>

      <div className="text-left text-base text-gray-600 border-l-4 border-green-400 pl-4 italic mt-2">
        {verse.translation}
      </div>

      {tafsirList.map((t, index) => (
        <div
          key={index}
          className="mt-4 pt-4 border-t border-green-100 text-sm text-gray-500"
        >
          <strong className="text-green-700">{t.source}:</strong> {t.text}
        </div>
      ))}
    </div>
  );
};

const SurahDetail = ({ surahNumber, onBackToList }) => {
  const [surahData, setSurahData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [currentVerseKey, setCurrentVerseKey] = useState(null);
  const audioRef = useRef(null);

  const fetchSurahData = useCallback(async (surah) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const params = new URLSearchParams({
        translation: "en.sahih",
        reciter: "mishary_rashid.mp3",
      }).toString();
      const response = await fetch(
        `${API_BASE_URL}/quran/surah/${surah}?${params}`,
        {
          method: "GET",
          headers: headers,
        }
      );

      if (response.status === 401 && token) {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("loginStatusChanged"));
        return fetchSurahData(surah);
      }

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status !== 401) {
          throw new Error(
            errorData.detail || `HTTP error! Status: ${response.status}`
          );
        }
      }

      const data = await response.json();
      setSurahData(data);
    } catch (err) {
      setError(`Failed to load Surah data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleBookmark = async (ayahKey) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to bookmark verses.");
      return;
    }

    const isBookmarked = surahData.verses.find(
      (v) => v.verse_key === ayahKey
    )?.bookmarked;
    const newVerses = surahData.verses.map((v) =>
      v.verse_key === ayahKey ? { ...v, bookmarked: !v.bookmarked } : v
    );
    setSurahData({ ...surahData, verses: newVerses });

    try {
      const response = await fetch(`${API_BASE_URL}/quran/bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ayah_key: ayahKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail ||
            `Failed to update bookmark status: ${response.status}`
        );
      }
    } catch (err) {
      setError(`Error: ${err.message}. Reverting bookmark status.`);
      setSurahData((prev) => ({
        ...prev,
        verses: prev.verses.map((v) =>
          v.verse_key === ayahKey ? { ...v, bookmarked: isBookmarked } : v
        ),
      }));
    }
  };

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current && surahData) {
      const timeMs = Math.round(audioRef.current.currentTime * 1000);
      setCurrentAudioTime(timeMs);

      if (currentVerseKey) {
        const currentVerse = surahData.verses.find(
          (v) => v.verse_key === currentVerseKey
        );
        const currentSurahNumber = parseInt(currentVerseKey.split(":")[0]);

        if (currentSurahNumber !== 1 && currentVerse && currentVerse.words) {
          const lastWord = currentVerse.words[currentVerse.words.length - 1];

          if (
            lastWord &&
            lastWord.timing &&
            timeMs > lastWord.timing.end + 500
          ) {
            const currentVerseIndex = surahData.verses.findIndex(
              (v) => v.verse_key === currentVerseKey
            );
            const nextVerse = surahData.verses[currentVerseIndex + 1];

            if (nextVerse && nextVerse.words && nextVerse.words[0].timing) {
              const nextFirstWord = nextVerse.words[0];
              const nextStartTimeMs = nextFirstWord.timing.start;

              audioRef.current.currentTime = nextStartTimeMs / 1000;
              setCurrentVerseKey(nextVerse.verse_key);
            } else {
              setIsPlaying(false);
              setCurrentVerseKey(null);
            }
          }
        }
      }
    }
  }, [surahData, currentVerseKey]);

  const handlePlayClicked = useCallback(
    (ayahKey) => {
      if (!audioRef.current || !surahData) {
        console.error("Audio ref or surah data is missing.");
        return;
      }

      const verse = surahData.verses.find((v) => v.verse_key === ayahKey);
      const surahNumber = parseInt(ayahKey.split(":")[0]);

      if (
        surahNumber !== 1 &&
        (!verse ||
          !verse.words ||
          verse.words.length === 0 ||
          !verse.words[0].timing)
      ) {
        console.error(
          "Verse or timing data missing for playback for key:",
          ayahKey,
          verse
        );
        alert(
          "Recitation audio timing data is missing for this verse. Check your backend log for timing data fetching."
        );
        return;
      }

      let startTimeMs = 0;

      if (surahNumber !== 1) {
        const firstWord = verse.words[0];
        startTimeMs = firstWord.timing.start;
      }

      audioRef.current.currentTime = startTimeMs / 1000;

      audioRef.current
        .play()
        .catch((e) => console.error("Error playing audio:", e));
      setIsPlaying(true);
      setCurrentVerseKey(ayahKey);
    },
    [surahData]
  );

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current.paused) {
        if (!currentVerseKey && surahData?.verses.length > 0) {
          handlePlayClicked(surahData.verses[0].verse_key);
        } else {
          audioRef.current
            .play()
            .catch((e) => console.error("Error playing audio:", e));
          setIsPlaying(true);
        }
      }
    }
  };

  useEffect(() => {
    if (surahNumber) {
      fetchSurahData(surahNumber);
    }

    const handleLoginStatusChange = () => {
      if (surahNumber) fetchSurahData(surahNumber);
    };
    window.addEventListener("loginStatusChanged", handleLoginStatusChange);

    return () => {
      window.removeEventListener("loginStatusChanged", handleLoginStatusChange);
    };
  }, [surahNumber, fetchSurahData]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const setPlay = () => setIsPlaying(true);
      const setPause = () => setIsPlaying(false);
      const setEnded = () => {
        setIsPlaying(false);
        setCurrentVerseKey(null);
        setCurrentAudioTime(0);
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("play", setPlay);
      audio.addEventListener("pause", setPause);
      audio.addEventListener("ended", setEnded);

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("play", setPlay);
        audio.removeEventListener("pause", setPause);
        audio.removeEventListener("ended", setEnded);
      };
    }
  }, [handleTimeUpdate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-600 absolute top-0"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-lg text-red-600 bg-red-50">
        {error}
      </div>
    );
  }

  const surahId = surahData?.id || 0;
  const showBismillah = surahId !== 1 && surahId !== 9;

  return (
    <main className="max-w-4xl mx-auto pt-4 pb-16">
      <button
        onClick={onBackToList}
        className="flex items-center justify-center w-10 h-10 mb-4 text-white bg-green-600 rounded-full hover:bg-green-700 transition shadow-md"
        title="Back to Surah List"
      >
        <ListOrdered size={20} />
      </button>

      <div className="text-center mb-6 p-6 bg-green-50 rounded-xl shadow-lg border-2 border-green-200">
        <h2
          className="text-3xl font-extrabold text-green-800 mb-2"
          style={{ fontFamily: "Amiri, serif" }}
        >
          {surahData?.name_arabic}
        </h2>
        <p className="text-xl font-semibold text-green-600 mb-4">
          {surahData?.name_complex} ({surahData?.name_translated})
        </p>
        <p className="text-sm text-gray-500 italic">
          {surahData?.revelation_place} • {surahData?.verses.length} Verses
        </p>
        {showBismillah && (
          <div
            className="mt-6 text-2xl text-gray-700 rtl"
            style={{ fontFamily: "Amiri, serif" }}
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>
        )}
      </div>

      {surahData?.audio_url && (
        <div className="mb-8 p-3 bg-white rounded-xl shadow-lg border border-green-200">
          <p className="text-center text-sm text-green-700 mb-2 font-semibold">
            Full Surah Recitation
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlayPause}
              className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition shadow-md"
              title={isPlaying ? "Pause" : "Play Full Surah"}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <audio
              ref={audioRef}
              src={API_BASE_URL + surahData.audio_url}
              className="w-full"
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-2xl divide-y divide-green-200/50">
        {surahData?.verses.map((verse) => (
          <QuranVerse
            key={verse.verse_key}
            verse={verse}
            toggleBookmark={toggleBookmark}
            currentAudioTime={currentAudioTime}
            currentVerseKey={currentVerseKey}
            onPlayClicked={handlePlayClicked}
          />
        ))}
      </div>
    </main>
  );
};

const QuranPage = () => {
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [showList, setShowList] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const selectSurah = (id) => {
    setSelectedSurah(id);
    setShowList(false);
  };

  useEffect(() => {
    if (showSearchBar) {
      searchInputRef.current?.focus();
    }
  }, [showSearchBar]);

  return (
    <div className="min-h-screen bg-white md:pt-16 pt-14">
      <nav className="sticky top-0 z-20 bg-white border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {showSearchBar ? (
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center space-x-2 w-full"
            >
              <div className="relative w-full">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search the Quran..."
                  className="w-full pl-10 pr-4 py-2 text-gray-700 bg-green-50 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition placeholder-gray-500 text-sm"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600"
                  size={20}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowSearchBar(false);
                  setSearchTerm("");
                }}
                className="p-2 text-gray-500 hover:text-red-600 transition"
                title="Close Search"
              >
                <X size={24} />
              </button>
            </form>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-green-700">Quran</h1>
              <button
                onClick={() => setShowSearchBar(true)}
                className="p-2 text-green-600 hover:text-green-800 transition rounded-full"
                title="Search"
              >
                <Search size={24} />
              </button>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showList || !selectedSurah ? (
          <SurahList onSelectSurah={selectSurah} />
        ) : (
          <SurahDetail
            surahNumber={selectedSurah}
            onBackToList={() => setShowList(true)}
          />
        )}
      </div>
    </div>
  );
};

export default QuranPage;
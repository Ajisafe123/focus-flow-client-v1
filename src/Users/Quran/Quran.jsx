import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Play,
  Pause,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  Volume2,
  BookOpen,
} from "lucide-react";
import SurahList from "./SurahList";
import PageHeader from "../../Components/Common/PageHeader";
import LoadingSpinner from "../../Components/Common/LoadingSpinner";
import {
  API_BASE_URL,
  fetchQuranPage,
  toggleQuranBookmark as toggleQuranBookmarkApi,
} from "../Service/apiService";

const QURAN_TOTAL_PAGES = 604;

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
        text-2xl sm:text-3xl 
        leading-[2.5] 
        rtl
        mx-1 sm:mx-2
        ${isHighlighted
          ? "text-emerald-500 font-bold transition-colors duration-100"
          : "text-emerald-900"
        }
      `}
    >
      {word.text_qpc_hafs}
    </span>
  );
};

const VerseMarker = ({ verseNumber }) => (
  <span className="inline-block relative top-0.5 mx-1 sm:mx-2 text-xl text-emerald-600">
    <svg viewBox="0 0 500 500" className="w-5 h-5 sm:w-6 sm:h-6 fill-current">
      <path d="M250 500c-138 0-250-112-250-250S112 0 250 0s250 112 250 250-112 250-250 250zm0-450c-110 0-200 90-200 200s90 200 200 200 200-90 200-200-90-200-200-200zM250 366c-48 0-87-39-87-87S202 192 250 192s87 39 87 87-39 87-87 87zm0-134c-26 0-47 21-47 47s21 47 47 47 47-21 47-47-21-47-47-47z" />
    </svg>
    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white z-10">
      {verseNumber}
    </span>
  </span>
);

const QuranVerse = ({
  verse,
  toggleBookmark,
  currentAudioTime,
  currentVerseKey,
  onPlayClicked,
  viewMode = "translation",
}) => {
  const isBookmarked = verse.bookmarked;
  const canBookmark = "bookmarked" in verse && toggleBookmark;
  const isCurrentVerse = verse.verse_key === currentVerseKey;
  const surahNumber = parseInt(verse.verse_key.split(":")[0]);
  const verseNumber = verse.verse_key.split(":")[1];

  const bookmarkIcon = isBookmarked ? BookmarkCheck : Bookmark;
  const bookmarkColor = isBookmarked
    ? "text-emerald-500"
    : canBookmark
      ? "text-emerald-700 hover:text-emerald-500"
      : "text-emerald-800 cursor-default";

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

  const renderArabicWords = () => {
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
        className="text-right text-2xl sm:text-3xl leading-[2.5] text-emerald-900 rtl mx-1 sm:mx-2"
        style={{ fontFamily: "Amiri, serif" }}
      >
        {verse.text_qpc_hafs}
      </span>
    );
  };

  if (viewMode === "reading") {
    return (
      <>
        {renderArabicWords()}
        <VerseMarker verseNumber={verseNumber} />
      </>
    );
  }

  return (
    <div
      className={`px-3 sm:px-6 md:px-8 border-b border-gray-200 hover:bg-emerald-50 transition duration-150 py-3 sm:py-3`}
    >
      <>
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <div className="flex items-center space-x-2 sm:space-x-3 text-sm font-medium">
            <span className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold text-xs sm:text-sm">
              {verseNumber}
            </span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              className={`transition p-1 hover:bg-emerald-100 ${isCurrentVerse
                ? "text-emerald-500"
                : "text-emerald-700 hover:text-emerald-500"
                }`}
              title="Play Recitation"
              onClick={() => onPlayClicked(verse.verse_key)}
            >
              <Play size={16} />
            </button>
            <button
              onClick={handleToggle}
              className={`transition duration-150 p-1 rounded-lg hover:bg-emerald-100 ${bookmarkColor}`}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Verse"}
              disabled={!canBookmark}
            >
              {React.createElement(bookmarkIcon, { size: 16 })}
            </button>
          </div>
        </div>

        <div className="rtl mb-2 text-center py-1">{renderArabicWords()}</div>
        <div className="text-left text-xs sm:text-sm leading-relaxed text-emerald-900 pl-3 mt-2">
          {verse.translation}
        </div>

        {tafsirList.map((t, index) => (
          <div
            key={index}
            className="mt-3 pt-3 border-t border-gray-200 text-xs text-emerald-800 leading-relaxed"
          >
            <strong className="text-emerald-500">{t.source}:</strong> {t.text}
          </div>
        ))}
      </>
    </div>
  );
};

const SurahDetail = ({ initialPage, onBackToList }) => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [currentVerseKey, setCurrentVerseKey] = useState(null);
  const [viewMode, setViewMode] = useState("translation");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const audioRef = useRef(null);
  const versesContainerRef = useRef(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioVolume, setAudioVolume] = useState(1);

  const currentVerses = pageData?.verses || [];
  const surahNumber = pageData?.surah_number || 0;
  const surahStartPage = pageData?.surah_start_page || currentPage;
  const surahEndPage = pageData?.surah_end_page || currentPage;

  const handleNextPage = useCallback(() => {
    if (currentPage < QURAN_TOTAL_PAGES) {
      setCurrentPage((prev) => prev + 1);
      setCurrentVerseKey(null);
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    }
  }, [currentPage]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setCurrentVerseKey(null);
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    }
  }, [currentPage]);

  const fetchPageData = useCallback(async (page) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    try {
      const params = new URLSearchParams({
        translation: "en.sahih",
        reciter: "mishary_rashid.mp3",
      }).toString();

      const data = await fetchQuranPage(page, token, {
        translation: "en.sahih",
        reciter: "mishary_rashid.mp3",
      });
      setPageData(data);
    } catch (err) {
      if (err.status === 401 && token) {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("loginStatusChanged"));
        return fetchPageData(page);
      }
      setError(
        `Failed to load Quran Page ${page} data: ${err.message}. Ensure your FastAPI server is running on ${API_BASE_URL}`
      );
    } finally {
      setLoading(false);
      if (versesContainerRef.current) {
        versesContainerRef.current.scrollTop = 0;
      }
    }
  }, []);

  const toggleBookmark = async (ayahKey) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to bookmark verses.");
      return;
    }

    const isBookmarked = pageData.verses.find(
      (v) => v.verse_key === ayahKey
    )?.bookmarked;
    const newVerses = pageData.verses.map((v) =>
      v.verse_key === ayahKey ? { ...v, bookmarked: !v.bookmarked } : v
    );
    setPageData({ ...pageData, verses: newVerses });

    try {
      await toggleQuranBookmarkApi(ayahKey, token);
    } catch (err) {
      setError(`Error: ${err.message}. Reverting bookmark status.`);
      setPageData((prev) => ({
        ...prev,
        verses: prev.verses.map((v) =>
          v.verse_key === ayahKey ? { ...v, bookmarked: isBookmarked } : v
        ),
      }));
    }
  };

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current && pageData) {
      const timeMs = Math.round(audioRef.current.currentTime * 1000);
      setCurrentAudioTime(timeMs);

      if (currentVerseKey) {
        const currentVerse = pageData.verses.find(
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
            const currentVerseIndex = pageData.verses.findIndex(
              (v) => v.verse_key === currentVerseKey
            );
            const nextVerse = pageData.verses[currentVerseIndex + 1];

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
  }, [pageData, currentVerseKey]);

  const handlePlayClicked = useCallback(
    (ayahKey) => {
      if (!audioRef.current || !pageData) {
        return;
      }

      const verse = pageData.verses.find((v) => v.verse_key === ayahKey);
      const surahNum = parseInt(ayahKey.split(":")[0]);

      if (surahNum === 1) {
        audioRef.current.currentTime = 0;
        audioRef.current
          .play()
          .catch((e) => console.error("Error playing audio:", e));
        setIsPlaying(true);
        setCurrentVerseKey(ayahKey);
        return;
      }

      if (
        !verse ||
        !verse.words ||
        verse.words.length === 0 ||
        !verse.words[0].timing
      ) {
        alert("Recitation audio timing data is missing for this verse.");
        return;
      }

      const firstWord = verse.words[0];
      const startTimeMs = firstWord.timing.start;

      audioRef.current.currentTime = startTimeMs / 1000;

      audioRef.current
        .play()
        .catch((e) => console.error("Error playing audio:", e));
      setIsPlaying(true);
      setCurrentVerseKey(ayahKey);
    },
    [pageData]
  );

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current.paused) {
        if (!currentVerseKey && pageData?.verses.length > 0) {
          const firstVerseOnPage = currentVerses[0];
          if (firstVerseOnPage) {
            handlePlayClicked(firstVerseOnPage.verse_key);
          }
        } else {
          audioRef.current
            .play()
            .catch((e) => console.error("Error playing audio:", e));
          setIsPlaying(true);
        }
      }
    }
  };

  const goToNextSurah = () => {
    handleNextPage();
  };

  const goToPreviousSurah = () => {
    handlePreviousPage();
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const seekTime = (e.target.value / 100) * audioDuration;
      audioRef.current.currentTime = seekTime;
      setCurrentAudioTime(Math.round(seekTime * 1000));
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setAudioVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

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
      const setLoadedMetadata = () => {
        setAudioDuration(audio.duration);
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("play", setPlay);
      audio.addEventListener("pause", setPause);
      audio.addEventListener("ended", setEnded);
      audio.addEventListener("loadedmetadata", setLoadedMetadata);
      audio.volume = audioVolume;

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("play", setPlay);
        audio.removeEventListener("pause", setPause);
        audio.removeEventListener("ended", setEnded);
        audio.removeEventListener("loadedmetadata", setLoadedMetadata);
      };
    }
  }, [handleTimeUpdate, audioVolume]);

  useEffect(() => {
    if (currentPage) {
      fetchPageData(currentPage);
    }

    const handleLoginStatusChanged = () => {
      if (currentPage) fetchPageData(currentPage);
    };
    window.addEventListener("loginStatusChanged", handleLoginStatusChanged);

    return () => {
      window.removeEventListener(
        "loginStatusChanged",
        handleLoginStatusChanged
      );
    };
  }, [currentPage, fetchPageData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <LoadingSpinner message="Loading Quran..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-lg text-red-600 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  const isNewSurahStart =
    currentVerses.length > 0 && currentVerses[0].verse_key.endsWith(":1");
  const showBismillah = isNewSurahStart && surahNumber !== 9;

  return (
    <main className="max-w-5xl mx-auto pt-4 pb-32 relative">
      <button
        onClick={onBackToList}
        className="flex items-center space-x-2 mb-6 text-emerald-700 hover:text-emerald-500 transition group"
        title="Back to Surah List"
      >
        <ChevronLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="text-sm font-medium">Back to Surah List</span>
      </button>

      <div className="flex justify-center mb-6 space-x-2 bg-gray-50 p-1 rounded-lg border border-gray-200 w-fit mx-auto">
        <button
          onClick={() => setViewMode("translation")}
          className={`px-6 py-2 rounded-lg transition flex items-center space-x-2 font-medium text-sm ${viewMode === "translation"
            ? "bg-white text-emerald-900 shadow-md border border-emerald-300"
            : "text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50"
            }`}
        >
          <BookmarkCheck size={16} />
          <span>Translation</span>
        </button>
        <button
          onClick={() => setViewMode("reading")}
          className={`px-6 py-2 rounded-lg transition flex items-center space-x-2 font-medium text-sm ${viewMode === "reading"
            ? "bg-white text-emerald-900 shadow-md border border-emerald-300"
            : "text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50"
            }`}
        >
          <BookmarkCheck size={16} />
          <span>Reading</span>
        </button>
      </div>

      <div className="text-center mb-1 p-6 sm:p-8 border-b border-gray-200 relative">
        <h2 className="aref-ruqaa-regular text-4xl sm:text-5xl font-bold text-emerald-900 mb-2 inline-block px-4 py-2">
          {pageData?.surah_name_arabic || "القرآن الكريم"}
        </h2>

        <h3 className="text-lg sm:text-xl font-medium text-emerald-700 mb-3">
          {pageData?.surah_name_simple}
        </h3>
      </div>

      <div className="text-center mb-6">
        <p className="text-sm font-semibold text-emerald-900 mt-2">
          Page {currentPage}
        </p>
      </div>

      {pageData?.audio_url && (
        <audio
          ref={audioRef}
          src={API_BASE_URL + pageData.audio_url}
          className="hidden"
        >
          Your browser does not support the audio element.
        </audio>
      )}

      <div className="relative">
        <div
          ref={versesContainerRef}
          className="bg-white rounded-xl border border-gray-200 p-6 sm:p-10"
        >
          {viewMode === "reading" ? (
            <div className="rtl text-center text-emerald-900 leading-relaxed max-w-xl mx-auto">
              {showBismillah && (
                <div
                  className="mb-6 text-2xl sm:text-3xl text-emerald-800 rtl"
                  style={{ fontFamily: "Amiri, serif" }}
                >
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
              )}
              {currentVerses.map((verse) => (
                <QuranVerse
                  key={verse.verse_key}
                  verse={verse}
                  currentAudioTime={currentAudioTime}
                  currentVerseKey={currentVerseKey}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {currentVerses.map((verse) => (
                <QuranVerse
                  key={verse.verse_key}
                  verse={verse}
                  toggleBookmark={toggleBookmark}
                  currentAudioTime={currentAudioTime}
                  currentVerseKey={currentVerseKey}
                  onPlayClicked={handlePlayClicked}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={goToPreviousSurah}
          disabled={currentPage <= 1}
          className={`px-4 py-2 rounded-lg border transition text-sm ${currentPage <= 1
            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white border-emerald-300 text-emerald-900 hover:bg-emerald-50"
            }`}
        >
          ← Previous Page
        </button>
        <button
          onClick={goToNextSurah}
          disabled={currentPage >= QURAN_TOTAL_PAGES}
          className={`px-4 py-2 rounded-lg border transition text-sm ${currentPage >= QURAN_TOTAL_PAGES
            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white border-emerald-300 text-emerald-900 hover:bg-emerald-50"
            }`}
        >
          Next Page →
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-3 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-grow">
            <button
              onClick={togglePlayPause}
              className="p-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 transition shadow-lg flex-shrink-0"
              title={isPlaying ? "Pause Audio" : "Play Audio"}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <div className="flex flex-col flex-grow min-w-0">
              <span className="text-xs text-gray-500 truncate">
                {currentVerseKey
                  ? `Reciting: ${currentVerseKey}`
                  : "Audio Ready"}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-emerald-900 flex-shrink-0 w-10">
                  {formatTime(currentAudioTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={
                    audioDuration > 0
                      ? (currentAudioTime / 1000 / audioDuration) * 100
                      : 0
                  }
                  onChange={handleSeek}
                  className="w-full h-1 bg-emerald-100 rounded-lg appearance-none cursor-pointer range-lg transition-colors duration-200 accent-emerald-600"
                />
                <span className="text-sm font-mono text-emerald-900 flex-shrink-0 w-10">
                  {formatTime(audioDuration * 1000)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0 hidden sm:flex">
            <Volume2 size={20} className="text-emerald-700" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={audioVolume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-emerald-100 rounded-lg appearance-none cursor-pointer range-sm transition-colors duration-200 accent-emerald-600"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

const QuranPage = () => {
  const [selectedSurahPage, setSelectedSurahPage] = useState(1);
  const [showList, setShowList] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const selectSurah = (pageNumber) => {
    setSelectedSurahPage(pageNumber);
    setShowList(false);
  };

  return (
    <div className="min-h-screen">
      {showList && (
        <PageHeader
          title="Al-Qur'an Al-Kareem"
          subtitle="The Noble Qur'an"
          icon={BookOpen}
          showSearch={true}
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onSearchSubmit={(val) => {
            if (val.trim()) {
              navigate(`/search-results?q=${encodeURIComponent(val)}`);
            }
          }}
          placeholder="Search Surahs or Verses (e.g., God, Paradise)..."
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showList || !selectedSurahPage ? (
          <SurahList onSelectSurah={selectSurah} />
        ) : (
          <SurahDetail
            initialPage={selectedSurahPage}
            onBackToList={() => setShowList(true)}
          />
        )}
      </div>
    </div>
  );
};

export default QuranPage;

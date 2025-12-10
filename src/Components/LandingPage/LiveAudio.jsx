import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  RotateCw,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Headphones,
  Info,
  ArrowLeft,
  Speaker,
  Clock,
  Tag,
  ThumbsUp,
  MessageSquare,
  Search,
  Eye,
} from "lucide-react";

const publishedAudioLectures = [
  {
    id: 101,
    title: "The Melodies of the Quran: Recitation Styles",
    category: "Qira'at",
    speaker: "Qari Abdul Basit",
    duration: "1:15:20",
    views: 35000,
    downloads: 12540,
    likes: 580,
    comments: 45,
    date: "2024-09-01",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    description:
      "An in-depth exploration of the various authentic styles of Quranic recitation (Qira'at). This lecture covers the history, methodology, and significance of different styles, helping listeners appreciate the beauty and depth of the Quran's sound. Essential for students of the Quran and those who wish to improve their listening.",
    thumbnail:
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400",
    mockComments: [
      {
        user: "Aisha M.",
        text: "SubhanAllah, the clarity of the recitation is truly moving.",
        date: "2025-11-01",
      },
      {
        user: "Omar K.",
        text: "Jazak Allah Khair for this detailed explanation of the styles.",
        date: "2025-11-03",
      },
    ],
  },
  {
    id: 103,
    title: "Jummah Khutbah: The Importance of Family",
    category: "Khutbah",
    speaker: "Imam Ali",
    duration: "20:05",
    views: 18500,
    downloads: 8900,
    likes: 310,
    comments: 22,
    date: "2024-11-01",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    description:
      "A powerful reminder of the essential role of family in Islam, based on Quranic verses and Sunnah. The lecture emphasizes maintaining ties of kinship and raising children with proper Islamic values.",
    thumbnail:
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400",
    mockComments: [
      {
        user: "Sara H.",
        text: "A much-needed reminder for our times.",
        date: "2025-10-29",
      },
    ],
  },
  {
    id: 104,
    title: "Du'a for Morning and Evening",
    category: "Du'a & Adhkar",
    speaker: "Various",
    duration: "12:45",
    views: 55000,
    downloads: 5020,
    likes: 720,
    comments: 88,
    date: "2024-11-05",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    description:
      "A soothing audio track featuring the recitation and translation of essential Adhkar (remembrances) for the morning and evening, to start and end your day with spiritual protection and peace.",
    thumbnail:
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400",
    mockComments: [
      {
        user: "Fahad A.",
        text: "Perfect for my daily routine.",
        date: "2025-11-04",
      },
      {
        user: "Noor J.",
        text: "May Allah reward the speaker.",
        date: "2025-11-05",
      },
    ],
  },
];

const formatTime = (time) => {
  if (isNaN(time) || time < 0) return "0:00";
  const totalSeconds = Math.floor(time);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  if (hours > 0) {
    timeString = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return timeString;
};

const AudioLecturePlayer = ({ selectedLecture, onBack }) => {
  const lecture = selectedLecture;
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [userLiked, setUserLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(lecture.likes);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [lecture.audioUrl]);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => console.error("Play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSkip = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleMuteToggle = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLikeToggle = () => {
    if (userLiked) {
      setCurrentLikes(currentLikes - 1);
    } else {
      setCurrentLikes(currentLikes + 1);
    }
    setUserLiked(!userLiked);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Audios
        </button>

        <audio
          ref={audioRef}
          src={lecture.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          preload="metadata"
        />

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-emerald-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg">
              <Headphones className="w-10 h-10" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
                {lecture.category}
              </p>
              <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                {lecture.title}
              </h2>
              <p className="text-gray-600 text-sm">{lecture.speaker}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div
              className="w-full h-1.5 bg-gray-200 rounded-full cursor-pointer group"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-emerald-600 rounded-full relative group-hover:h-2 transition-all"
                style={{
                  width: `${(currentTime / duration) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-gray-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 py-2">
            <button
              onClick={() => handleSkip(-15)}
              className="p-3 text-gray-600 hover:text-emerald-600 transition-colors"
              title="Rewind 15 seconds"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-emerald-700 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-white" />
              ) : (
                <Play className="w-8 h-8 fill-white ml-1" />
              )}
            </button>
            <button
              onClick={() => handleSkip(30)}
              className="p-3 text-gray-600 hover:text-emerald-600 transition-colors"
              title="Forward 30 seconds"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full transition-colors ${
                  userLiked
                    ? "text-white bg-emerald-600 hover:bg-emerald-700"
                    : "text-gray-600 hover:text-emerald-600 hover:bg-gray-100"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                Like ({currentLikes.toLocaleString()})
              </button>
              <button
                onClick={handleMuteToggle}
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors text-sm">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <a
                href={lecture.audioUrl}
                download
                className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 transition-colors font-semibold text-sm"
              >
                <Download className="w-4 h-4" /> Download
              </a>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 border-b pb-3">
            <Info className="w-5 h-5 text-emerald-600" /> Lecture Details &
            Stats
          </h3>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-gray-600">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-emerald-600" /> Views:{" "}
              {lecture.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Speaker className="w-4 h-4 text-emerald-600" /> Downloads:{" "}
              {lecture.downloads.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4 text-emerald-600" /> Likes:{" "}
              {lecture.likes.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4 text-emerald-600" /> Comments:{" "}
              {lecture.comments.toLocaleString()}
            </span>
          </div>

          <p
            className={`text-gray-700 whitespace-pre-line ${
              !descriptionExpanded ? "line-clamp-3" : ""
            }`}
          >
            {lecture.description}
          </p>
          <button
            onClick={() => setDescriptionExpanded(!descriptionExpanded)}
            className="flex items-center gap-1 text-emerald-600 font-semibold mt-2 hover:text-emerald-700 text-sm"
          >
            {descriptionExpanded ? (
              <>
                Show less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show more <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 border-b pb-3">
            <MessageSquare className="w-5 h-5 text-emerald-600" /> User Comments
            ({lecture.comments.toLocaleString()})
          </h3>
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <textarea
              rows="2"
              placeholder="Share your thoughts or ask a question..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none text-sm"
            ></textarea>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-sm">
              Post Comment
            </button>
          </div>
          <div className="space-y-4 pt-4">
            {lecture.mockComments &&
              lecture.mockComments.map((comment, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-3 last:border-b-0"
                >
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-gray-800">
                      {comment.user}
                    </span>
                    <span className="text-gray-400">{comment.date}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{comment.text}</p>
                </div>
              ))}
            {lecture.mockComments.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                Be the first to leave a comment!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LiveAudio = () => {
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLectureSelect = (lecture) => {
    setSelectedLecture(lecture);
  };

  const handleBackToDashboard = () => {
    setSelectedLecture(null);
  };

  const filteredLectures = publishedAudioLectures.filter(
    (lecture) =>
      lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedLecture) {
    return (
      <AudioLecturePlayer
        selectedLecture={selectedLecture}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <Headphones className="w-7 h-7 text-emerald-600" />
        Audio Lecture Hub
      </h2>

      <div className="mb-6">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audio titles, speakers, or categories..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredLectures.length > 0 ? (
          filteredLectures.map((lecture) => (
            <div
              key={lecture.id}
              onClick={() => handleLectureSelect(lecture)}
              className="bg-white rounded-xl shadow-md p-4 flex gap-4 items-center cursor-pointer hover:shadow-lg hover:bg-emerald-50 transition-all duration-300 border border-gray-100"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-xl">
                <Headphones className="w-8 h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 line-clamp-2 mb-1">
                  {lecture.title}
                </h3>
                <p className="text-sm text-gray-600">{lecture.speaker}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {lecture.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {lecture.views.toLocaleString()}{" "}
                    views
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                    <Tag className="w-3 h-3" /> {lecture.category}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <ThumbsUp className="w-3 h-3 text-emerald-600" />{" "}
                    {lecture.likes.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <MessageSquare className="w-3 h-3 text-emerald-600" />{" "}
                    {lecture.comments.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-10 bg-white rounded-xl shadow-md">
            <p className="text-lg text-gray-600">
              No audio lectures found matching "{searchQuery}".
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-emerald-600 font-semibold hover:text-emerald-700"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveAudio;

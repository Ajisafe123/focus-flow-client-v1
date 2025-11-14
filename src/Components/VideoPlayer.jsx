import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Flag,
  ChevronDown,
  ChevronUp,
  Eye,
  Tag,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  MonitorPlay,
  SkipBack,
  SkipForward,
  MessageSquare,
  Zap,
} from "lucide-react";

const publishedLectures = [
  {
    id: 1,
    title: "Understanding Zakat: Complete Guide",
    speaker: "Sheikh Ahmed Hassan",
    description:
      "A comprehensive lecture covering the principles, calculation, and distribution of Zakat in modern times. Learn about Nisab thresholds, eligible recipients, and contemporary financial applications.",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=800&auto=format&fit=crop",
    duration: "45:30",
    views: 15420,
    likes: 892,
    category: "Islamic Finance",
    date: "2024-10-15",
  },
  {
    id: 2,
    title: "The Science of Hadith Authentication",
    speaker: "Dr. Fatima Al-Zahra",
    description:
      "Explore the rigorous methodology of hadith verification, from chain of narration to narrator reliability. Understanding Sahih, Hassan, and Daif classifications.",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?q=80&w=800&auto=format&fit=crop",
    duration: "38:15",
    views: 12300,
    likes: 756,
    category: "Hadith Studies",
    date: "2024-10-12",
  },
  {
    id: 3,
    title: "Prophetic Leadership Lessons",
    speaker: "Imam Ibrahim Malik",
    description:
      "Drawing management and leadership insights from the Seerah. How the Prophet (PBUH) built teams, resolved conflicts, and inspired excellence.",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1609156842548-b5c345a4b fc5?q=80&w=800&auto=format&fit=crop",
    duration: "52:40",
    views: 18900,
    likes: 1120,
    category: "Seerah",
    date: "2024-10-08",
  },
  {
    id: 4,
    title: "Quranic Arabic Grammar Foundations",
    speaker: "Ustadh Omar Farooq",
    description:
      "Master the grammatical structures that unlock deeper Quranic meanings. Learn I'rab, sentence patterns, and morphological analysis with practical examples.",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1564769610726-4e2f785a7b2f?q=80&w=800&auto=format&fit=crop",
    duration: "41:20",
    views: 9850,
    likes: 634,
    category: "Quran",
    date: "2024-10-05",
  },
];

const storyProfiles = [
  {
    id: 101,
    name: "Live Q&A",
    status: "LIVE",
    thumbnail:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=320&auto=format&fit=crop",
  },
  {
    id: 102,
    name: "Hadith Tip",
    status: "New",
    thumbnail:
      "https://images.unsplash.com/photo-1512496013625-e553da56294e?q=80&w=320&auto=format&fit=crop",
  },
  {
    id: 103,
    name: "Daily Verse",
    status: "Seen",
    thumbnail:
      "https://images.unsplash.com/photo-1557774780-60b54378f4ed?q=80&w=320&auto=format&fit=crop",
  },
  {
    id: 104,
    name: "Fiqh Basics",
    status: "New",
    thumbnail:
      "https://images.unsplash.com/photo-1549488344-9c049d59e9a1?q=80&w=320&auto=format&fit=crop",
  },
  {
    id: 105,
    name: "Seerah Fact",
    status: "Seen",
    thumbnail:
      "https://images.unsplash.com/photo-1610476044719-756ef26e7a2b?q=80&w=320&auto=format&fit=crop",
  },
  {
    id: 106,
    name: "Prayer Time",
    status: "New",
    thumbnail:
      "https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?q=80&w=320&auto=format&fit=crop",
  },
];

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const SKIP_TIME = 10;
const initialComments = [
  {
    id: 1,
    user: "Ahmed Hassan",
    text: "MashAllah, excellent explanation.",
    time: "2 days ago",
    likes: 45,
  },
  {
    id: 2,
    user: "Fatima Ali",
    text: "JazakAllah khair! Very helpful.",
    time: "1 week ago",
    likes: 32,
  },
  {
    id: 3,
    user: "Omar Khan",
    text: "Great points on financial ethics!",
    time: "4 days ago",
    likes: 15,
  },
];

const formatTime = (time) => {
  if (isNaN(time) || time < 0) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const formatCount = (count) => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  }
  return count.toLocaleString();
};

const navigateToVideo = (videoId) => {
  window.location.href = `/videos/${videoId}`;
};

const Story = ({ profile }) => {
  const isLive = profile.status === "LIVE";
  const isNew = profile.status === "New";
  const ringColor = isLive
    ? "ring-red-500"
    : isNew
    ? "ring-emerald-500"
    : "ring-gray-300";
  const ringThickness = isLive ? "ring-4" : "ring-2";
  const textClassName = isLive
    ? "text-red-600 font-bold"
    : "text-gray-700 font-medium";

  return (
    <div className="flex-none w-20 text-center cursor-pointer group">
      <div className="relative">
        <div
          className={`w-16 h-16 mx-auto rounded-full overflow-hidden ${ringThickness} ${ringColor} ${
            isLive ? "animate-pulse-slow" : "group-hover:ring-4"
          } transition-all duration-300`}
          style={{
            animation: isLive
              ? "pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
              : "none",
          }}
        >
          <img
            src={profile.thumbnail}
            alt={profile.name}
            className="w-full h-full object-cover"
            style={{ borderRadius: "50%" }}
          />
        </div>
        {isLive && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3 px-2 py-0.5 bg-red-600 text-white text-[10px] uppercase font-extrabold rounded-full flex items-center gap-1 border border-white">
            <Zap className="w-3 h-3 fill-white" />
            LIVE
          </div>
        )}
      </div>
      <p className={`mt-2 text-xs ${textClassName} line-clamp-1`}>
        {profile.name}
      </p>
    </div>
  );
};

const RecommendedVideoCard = ({ video, onSelect }) => (
  <div
    key={video.id}
    onClick={() => onSelect(video.id)}
    className={`flex gap-3 cursor-pointer p-2 rounded-lg transition-colors hover:bg-gray-100`}
  >
    <div className="relative w-40 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
        {video.duration}
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className={`font-semibold text-sm text-gray-900 line-clamp-2 mb-1`}>
        {video.title}
      </h4>
      <p className="text-xs text-gray-600">{video.speaker}</p>
      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
        <span>{formatCount(video.views)} views</span>
        <span>•</span>
        <span>{new Date(video.date).toLocaleDateString()}</span>
      </div>
    </div>
  </div>
);

const VideoPlayer = ({ videoId = "1" }) => {
  const video =
    publishedLectures.find((v) => v.id.toString() === videoId) ||
    publishedLectures[0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(initialComments);

  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const volumeBeforeMute = useRef(1);

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Video Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The video with ID **{videoId}** could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const handleSeekChange = (newTime) => {
    if (videoRef.current) {
      const clampedTime = Math.max(0, Math.min(newTime, duration));
      videoRef.current.currentTime = clampedTime;
      setCurrentTime(clampedTime);
    }
  };

  const skipForward = () => handleSeekChange(currentTime + SKIP_TIME);
  const skipBackward = () => handleSeekChange(currentTime - SKIP_TIME);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.error("Autoplay failed:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.playbackRate = playbackSpeed;
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    handleSeekChange(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      if (newVolume > 0) {
        setIsMuted(false);
        volumeBeforeMute.current = newVolume;
      } else {
        setIsMuted(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        const newVolume =
          volumeBeforeMute.current > 0.05 ? volumeBeforeMute.current : 0.5;
        videoRef.current.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(false);
      } else {
        volumeBeforeMute.current = volume;
        videoRef.current.volume = 0;
        setVolume(0);
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = useCallback(() => {
    if (playerContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        playerContainerRef.current.requestFullscreen().catch(() => {});
        setIsFullscreen(true);
      }
    }
  }, []);

  const handleSpeedChange = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    }
  };

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setLiked(false);
    setDisliked(false);
    setDescriptionExpanded(false);

    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.playbackRate = playbackSpeed;

      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          setIsPlaying(false);
        });
    }
  }, [video, playbackSpeed]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          skipBackward();
          break;
        case "ArrowRight":
          skipForward();
          break;
        case "m":
        case "M":
          toggleMute();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleFullscreen, togglePlay, skipBackward, skipForward, toggleMute]);

  const handleVideoSelect = (newVideoId) => {
    navigateToVideo(newVideoId);
  };

  const recommendedVideos = publishedLectures
    ? publishedLectures.filter((l) => l.id.toString() !== video.id.toString())
    : [];

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        user: "You",
        text: newComment,
        time: "Just now",
        likes: 0,
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        .story-scroll::-webkit-scrollbar { height: 0; }
        .story-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes pulse-slow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white py-4 px-4 mb-4 mt-6 border-b-2 border-gray-200 rounded-xl shadow-md">
          <div
            className="flex space-x-6 overflow-x-scroll story-scroll pb-2"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {storyProfiles.map((profile) => (
              <Story key={profile.id} profile={profile} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 pb-6">
          <div className="lg:col-span-2 space-y-4">
            <div
              ref={playerContainerRef}
              className={`relative bg-black ${
                isFullscreen
                  ? "w-screen h-screen max-w-none max-h-none fixed top-0 left-0 z-50 rounded-none"
                  : "rounded-xl aspect-video w-full h-auto border-2 border-gray-200"
              } transition-all duration-300`}
              onDoubleClick={toggleFullscreen}
            >
              <video
                ref={videoRef}
                key={video.id}
                src={video.videoUrl}
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
                preload="auto"
              />

              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 opacity-100`}
              >
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={togglePlay}
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white" />
                      ) : (
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1" />
                      )}
                    </button>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 space-y-1 sm:space-y-2 text-white">
                  <div
                    className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer group"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-emerald-600 rounded-full relative group-hover:h-2 transition-all"
                      style={{
                        width: `${(currentTime / duration) * 100}%`,
                      }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-3">
                      <button
                        onClick={togglePlay}
                        className="p-1 hover:bg-white/20 rounded"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
                        ) : (
                          <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
                        )}
                      </button>

                      <button
                        onClick={skipBackward}
                        className="p-1 hover:bg-white/20 rounded hidden sm:block"
                      >
                        <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>

                      <button
                        onClick={skipForward}
                        className="p-1 hover:bg-white/20 rounded hidden sm:block"
                      >
                        <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>

                      <div className="flex items-center group relative">
                        <button
                          onClick={toggleMute}
                          className="p-1 hover:bg-white/20 rounded"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
                          ) : (
                            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                          )}
                        </button>

                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-0 opacity-0 group-hover:w-16 group-focus-within:w-16 sm:group-hover:w-20 sm:group-focus-within:w-20 group-hover:opacity-100 group-focus-within:opacity-100 ml-2 h-1 transition-all duration-200 cursor-pointer accent-emerald-600"
                        />
                      </div>

                      <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-3">
                      <div className="relative">
                        <button
                          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                          className="p-1 hover:bg-white/20 rounded flex items-center gap-1 text-xs sm:text-sm font-semibold"
                        >
                          <MonitorPlay className="w-4 h-4 sm:w-5 sm:h-5" />
                          {playbackSpeed !== 1 ? `${playbackSpeed}x` : "Speed"}
                        </button>

                        {showSpeedMenu && (
                          <div className="absolute bottom-full right-0 mb-2 w-24 sm:w-28 bg-black/80 rounded-lg overflow-hidden z-10">
                            {PLAYBACK_SPEEDS.map((speed) => (
                              <button
                                key={speed}
                                onClick={() => handleSpeedChange(speed)}
                                className={`block w-full text-left px-3 py-1 text-xs sm:text-sm ${
                                  playbackSpeed === speed
                                    ? "bg-emerald-600 font-bold"
                                    : "hover:bg-white/20"
                                }`}
                              >
                                {speed === 1 ? "Normal" : `${speed}x`}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={toggleFullscreen}
                        className="p-1 hover:bg-white/20 rounded"
                      >
                        {isFullscreen ? (
                          <Minimize className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : (
                          <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                {video.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-2 sm:mb-0">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-emerald-500" />
                    {video.views.toLocaleString()} views
                  </span>
                  <span>{new Date(video.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full font-semibold">
                    <Tag className="w-3 h-3" />
                    {video.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full transition-colors text-sm sm:text-base ${
                    liked
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="font-semibold">
                    {(video.likes + (liked ? 1 : 0)).toLocaleString()}
                  </span>
                </button>
                <button
                  onClick={handleDislike}
                  className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full transition-colors text-sm sm:text-base ${
                    disliked
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm sm:text-base">
                  <Share2 className="w-4 h-4" />
                  <span className="font-semibold">Share</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors ml-auto text-sm sm:text-base">
                  <Flag className="w-4 h-4" />
                  Report
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {video.speaker.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {video.speaker}
                  </h3>
                  <p className="text-sm text-gray-600">Islamic Scholar</p>
                </div>
              </div>

              <div>
                <p
                  className={`text-gray-700 whitespace-pre-line text-sm sm:text-base ${
                    !descriptionExpanded ? "line-clamp-3" : ""
                  }`}
                >
                  {video.description}
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
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                {comments.length} Comments
              </h3>

              <div className="flex gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  Y
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a public comment..."
                    className="w-full px-2 py-2 border-b-2 border-gray-200 focus:border-emerald-600 focus:outline-none"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setNewComment("")}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {comment.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm">
                          {comment.user}
                        </span>
                        <span className="text-xs text-gray-500">
                          {comment.time}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2 text-sm">
                        {comment.text}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <button className="flex items-center gap-1 text-gray-600 hover:text-emerald-600">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{comment.likes}</span>
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky lg:top-4">
              <h3 className="font-bold text-gray-900 mb-4 text-lg border-b pb-2">
                Up next
              </h3>
              <div className="space-y-3">
                {recommendedVideos.map((recommendedVideo) => (
                  <RecommendedVideoCard
                    key={recommendedVideo.id}
                    video={recommendedVideo}
                    onSelect={handleVideoSelect}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-white text-gray-800 py-8 mt-16 shadow-inner border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">End of Video Content.</p>
        </div>
      </footer>
    </div>
  );
};

export default VideoPlayer;

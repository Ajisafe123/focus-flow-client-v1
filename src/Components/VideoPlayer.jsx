import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowLeft,
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
} from "lucide-react";

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
];

const formatTime = (time) => {
  if (isNaN(time) || time < 0) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const VideoPlayer = ({ selectedVideo, setSelectedVideo, lectures }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls] = useState(true);
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
        videoRef.current.play().catch(() => {});
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
        playerContainerRef.current.requestFullscreen();
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
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const recommendedVideos = lectures
    ? lectures.filter((l) => l.id !== selectedVideo?.id).slice(0, 6)
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
      <div className="max-w-7xl mx-auto">
        <div className="p-4">
          <button
            onClick={() => setSelectedVideo(null)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Videos
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 pb-6">
          <div className="lg:col-span-2 space-y-4">
            <div
              ref={playerContainerRef}
              className={`relative bg-black shadow-xl ${
                isFullscreen
                  ? "w-screen h-screen max-w-none max-h-none fixed top-0 left-0 z-50 rounded-none"
                  : "rounded-xl aspect-video"
              } transition-all duration-300`}
              onDoubleClick={toggleFullscreen}
            >
              <video
                ref={videoRef}
                src={selectedVideo.videoUrl}
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
              />

              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={togglePlay}
                      className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-2xl"
                    >
                      <Play className="w-10 h-10 text-white fill-white ml-1" />
                    </button>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 text-white">
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
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlay}
                        className="p-1 hover:bg-white/20 rounded"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6 fill-white" />
                        ) : (
                          <Play className="w-6 h-6 fill-white" />
                        )}
                      </button>

                      <button
                        onClick={skipBackward}
                        className="p-1 hover:bg-white/20 rounded"
                      >
                        <SkipBack className="w-6 h-6" />
                      </button>

                      <button
                        onClick={skipForward}
                        className="p-1 hover:bg-white/20 rounded"
                      >
                        <SkipForward className="w-6 h-6" />
                      </button>

                      <div className="flex items-center group relative">
                        <button
                          onClick={toggleMute}
                          className="p-1 hover:bg-white/20 rounded"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-6 h-6" />
                          ) : (
                            <Volume2 className="w-6 h-6" />
                          )}
                        </button>

                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-0 opacity-0 group-hover:w-20 group-hover:opacity-100 ml-2 h-1 transition-all duration-200 cursor-pointer accent-emerald-600"
                        />
                      </div>

                      <span className="text-sm font-medium">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <button
                          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                          className="p-1 hover:bg-white/20 rounded flex items-center gap-1 text-sm font-semibold"
                        >
                          <MonitorPlay className="w-5 h-5" />
                          {playbackSpeed !== 1 ? `${playbackSpeed}x` : "Speed"}
                        </button>

                        {showSpeedMenu && (
                          <div className="absolute bottom-full right-0 mb-2 w-28 bg-black/80 rounded-lg overflow-hidden shadow-lg z-10">
                            {PLAYBACK_SPEEDS.map((speed) => (
                              <button
                                key={speed}
                                onClick={() => handleSpeedChange(speed)}
                                className={`block w-full text-left px-3 py-1.5 text-sm ${
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
                          <Minimize className="w-6 h-6" />
                        ) : (
                          <Maximize className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {selectedVideo.title}
              </h1>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {selectedVideo.views.toLocaleString()} views
                  </span>
                  <span>
                    {new Date(selectedVideo.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full font-semibold">
                    <Tag className="w-3 h-3" />
                    {selectedVideo.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    liked
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="font-semibold">
                    {(selectedVideo.likes + (liked ? 1 : 0)).toLocaleString()}
                  </span>
                </button>
                <button
                  onClick={handleDislike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    disliked
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span className="font-semibold">Share</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors ml-auto">
                  <Flag className="w-4 h-4" />
                  Report
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {selectedVideo.speaker.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {selectedVideo.speaker}
                  </h3>
                  <p className="text-sm text-gray-600">Islamic Scholar</p>
                </div>
              </div>

              <div>
                <p
                  className={`text-gray-700 whitespace-pre-line ${
                    !descriptionExpanded ? "line-clamp-3" : ""
                  }`}
                >
                  {selectedVideo.description}
                </p>
                <button
                  onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                  className="flex items-center gap-1 text-emerald-600 font-semibold mt-2 hover:text-emerald-700"
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

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {comments.length} Comments
              </h3>

              <div className="flex gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  Y
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a public comment..."
                    className="w-full px-4 py-2 border-b-2 border-gray-200 focus:border-emerald-600 focus:outline-none"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setNewComment("")}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {comment.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {comment.user}
                        </span>
                        <span className="text-sm text-gray-500">
                          {comment.time}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{comment.text}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <button className="flex items-center gap-1 text-gray-600 hover:text-emerald-600">
                          <ThumbsUp className="w-4 h-4" />
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
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-bold text-gray-900 mb-4">Recommended</h3>
              <div className="space-y-3">
                {recommendedVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => handleVideoSelect(video)}
                    className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="relative w-40 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-600">{video.speaker}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{video.views.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

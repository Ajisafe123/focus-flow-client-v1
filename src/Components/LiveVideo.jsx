import React, { useState } from "react";
import { ArrowLeft, Eye, Tag, Play } from "lucide-react";
import UserVideoPlayer from "./VideoPlayer";

const publishedLectures = [
  {
    id: 1,
    title: "Complete Guide to Wudu and Salah",
    category: "Fiqh",
    speaker: "Dr. Fatima",
    status: "published",
    views: 18230,
    likes: 1890,
    dislikes: 23,
    comments: 134,
    date: "2024-10-20",
    duration: "52:15",
    thumbnail:
      "https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3", // Ablution hands
    featured: false,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description:
      "Learn the proper method of performing Wudu (ablution) and the five daily prayers according to authentic Sunnah. This detailed guide covers everything from the prerequisites to the completion of Salah.",
  },
  {
    id: 3,
    title: "The Biography of Prophet Muhammad (PBUH) - Part 1",
    category: "Seerah",
    speaker: "Ustadha Aishah",
    status: "published",
    views: 32100,
    likes: 3100,
    dislikes: 55,
    comments: 210,
    date: "2024-10-25",
    duration: "65:00",
    thumbnail:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop", // Desert and sunrise theme
    featured: true,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    description:
      "The first part of a series covering the life of the Prophet Muhammad, from his birth to the beginning of revelation. Essential for understanding Islamic history and his character.",
  },
  {
    id: 5,
    title: "Financial Transactions in Islam (Riba & Halal Earnings)",
    category: "Fiqh",
    speaker: "Dr. Hamza",
    status: "published",
    views: 11500,
    likes: 1020,
    dislikes: 15,
    comments: 75,
    date: "2024-10-28",
    duration: "40:00",
    thumbnail:
      "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=800&auto=format&fit=crop", // Finance/market theme
    featured: false,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    description:
      "A clear explanation of the Islamic rules concerning finance, distinguishing between permissible (Halal) and forbidden (Haram) forms of earning and investment, with a focus on avoiding Riba (usury/interest).",
  },
  {
    id: 6,
    title: "Inner Peace: Taming the Nafs (Soul)",
    category: "Tazkiyah",
    speaker: "Sheikh Ahmed",
    status: "published",
    views: 22800,
    likes: 2150,
    dislikes: 30,
    comments: 150,
    date: "2024-11-01",
    duration: "50:45",
    thumbnail:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop", // Calm landscape meditation theme
    featured: true,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndSnow.mp4",
    description:
      "A spiritual lesson on the concept of 'Nafs' (the soul or self), and practical steps for purification (Tazkiyah) to achieve inner tranquility and drawing closer to Allah.",
  },
];

const LiveVideo = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  if (selectedVideo) {
    return (
      <UserVideoPlayer
        selectedVideo={selectedVideo}
        setSelectedVideo={setSelectedVideo}
        lectures={publishedLectures}
      />
    );
  }

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen bg-gray-50">
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="header-text text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
          Latest <span className="text-emerald-600">Islamic Lectures</span>
        </h2>
        <p className="text-gray-600 text-base max-w-xl mx-auto">
          Explore powerful insights from respected scholars and teachers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {publishedLectures.map((video) => (
          <div
            key={video.id}
            onClick={() => handleVideoSelect(video)}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-0.5"
          >
            <div className="relative aspect-video">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                {video.duration}
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-gray-900 line-clamp-2 mb-1">
                {video.title}
              </h4>
              <p className="text-sm text-gray-600 mb-3">{video.speaker}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {video.views.toLocaleString()} views
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                  <Tag className="w-3 h-3" />
                  {video.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveVideo;

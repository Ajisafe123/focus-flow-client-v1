import React from "react";
import { ArrowRight, Eye, Heart, Film, Play, Clock } from "lucide-react";

export const publishedLectures = [
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
      "https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    featured: false,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description:
      "Learn the proper method of performing Wudu (ablution) and the five daily prayers according to authentic Sunnah. This detailed guide covers everything from the prerequisites to the completion of Salah.",
  },
  {
    id: 2,
    title: "Understanding the Quran's Structure (Juz & Surah)",
    category: "Tafsir",
    speaker: "Ustadh Khalid",
    status: "published",
    views: 15500,
    likes: 1450,
    dislikes: 18,
    comments: 98,
    date: "2024-11-05",
    duration: "45:30",
    thumbnail:
      "https://images.unsplash.com/photo-1577771746200-a5ff9525c38c?q=80&w=800&auto=format&fit=crop",
    featured: false,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description:
      "An introductory lecture on the organization of the Quran, explaining the concepts of Juz (part) and Surah (chapter), and how they aid in study and recitation.",
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
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop",
    featured: true,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    description:
      "The first part of a series covering the life of the Prophet Muhammad, from his birth to the beginning of revelation. Essential for understanding Islamic history and his character.",
  },
  {
    id: 4,
    title: "Daily Duas and Adhkar for Protection",
    category: "Adhkar",
    speaker: "Sheikh Yasin",
    status: "published",
    views: 28900,
    likes: 2700,
    dislikes: 12,
    comments: 180,
    date: "2024-11-10",
    duration: "30:00",
    thumbnail:
      "https://images.unsplash.com/photo-1610476044719-756ef26e7a2b?q=80&w=800&auto=format&fit=crop",
    featured: false,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description:
      "A practical session on reciting the essential morning and evening supplications (Duas and Adhkar) as taught by the Prophet (PBUH) for daily protection and remembrance of Allah.",
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
      "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=800&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
    featured: true,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndSnow.mp4",
    description:
      "A spiritual lesson on the concept of 'Nafs' (the soul or self), and practical steps for purification (Tazkiyah) to achieve inner tranquility and drawing closer to Allah.",
  },
];

const formatCount = (count) => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  }
  return count.toLocaleString();
};

export default function VideoListHorizontalScroll() {
  const VIDEOS = publishedLectures;

  const handleVideoClick = (videoId) => {
    window.location.href = `/video/${videoId}`;
  };

  const handleViewAllVideosClick = () => {
    window.location.href = `/videos`;
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50 py-10 px-4">
      <style>{`
        .horizontal-scroll::-webkit-scrollbar { height: 8px; }
        .horizontal-scroll::-webkit-scrollbar-thumb { background-color: #10b981; border-radius: 4px; }
        .horizontal-scroll::-webkit-scrollbar-thumb:hover { background-color: #059669; }
        .horizontal-scroll::-webkit-scrollbar-track { background-color: #f3f4f6; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            Featured <span className="text-emerald-600">Video Lectures</span>
          </h1>
          <p className="text-gray-600 mt-2 text-md">
            Dive into our collection of insightful Islamic video lectures.
          </p>
        </div>

        <div
          className="flex space-x-4 overflow-x-scroll horizontal-scroll pb-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {VIDEOS.map((video) => {
            return (
              <div
                key={video.id}
                className="flex-none w-50 group cursor-pointer bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                onClick={() => handleVideoClick(video.id)}
              >
                <div className="relative h-28 overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentNode.style.backgroundColor = "#d1fae5";
                      e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center"><Film class="w-6 h-6 text-emerald-500" /></div>`;
                    }}
                  />
                  {/* Play Icon - Always Visible */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="bg-white/90 p-2 rounded-full shadow-md">
                      <Play className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>

                  <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 shadow-md">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                  </div>
                  {video.featured && (
                    <div className="absolute top-1 left-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow-md">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h4 className="text-sm font-bold text-gray-800 group-hover:text-emerald-600 transition-colors mb-1 line-clamp-2">
                    {video.title}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    By:{" "}
                    <span className="font-medium text-teal-600">
                      {video.speaker}
                    </span>
                  </p>

                  <div className="flex justify-between text-[10px] text-gray-500 border-t border-gray-100 pt-2">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-emerald-500" />
                      {formatCount(video.views)} Views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-500" />
                      {formatCount(video.likes)} Likes
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-start mt-6">
          <button
            onClick={handleViewAllVideosClick}
            className="inline-flex items-center text-md font-semibold text-emerald-600 hover:text-emerald-700 transition-colors py-2 px-4 rounded-full border border-emerald-300 hover:bg-emerald-50 shadow-sm"
          >
            View All Lectures
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
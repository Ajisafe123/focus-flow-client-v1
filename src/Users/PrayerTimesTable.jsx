import React, { useEffect, useState, useRef, useCallback } from "react";
import { Clock, Volume2, VolumeX, MapPin, User, Calendar } from "lucide-react";
import {
  fetchAzanAudio,
  fetchPrayerTimes as fetchPrayerTimesApi,
  fetchProfileMe,
  fetchReverseGeocode,
  updateMuteStatus,
  updateProfileLocation,
} from "./Service/apiService";

const DEFAULT_LAT = 7.3775;
const DEFAULT_LON = 3.947;

import LoadingSpinner from "../Components/Common/LoadingSpinner";

export default function PrayerTimesTable() {
  const [prayerData, setPrayerData] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [userLocation, setUserLocation] = useState("Fetching location...");
  const [username, setUsername] = useState("Guest");
  const [useProfileLocation, setUseProfileLocation] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const timerRef = useRef(null);
  const lastPrayerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const audioBufferRef = useRef(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isAuthenticated = !!token;

  const loadAudio = useCallback(async () => {
    if (!isAuthenticated || audioBufferRef.current) return;
    if (!audioCtxRef.current)
      audioCtxRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    try {
      const arrayBuffer = await fetchAzanAudio();
      audioBufferRef.current = await audioCtxRef.current.decodeAudioData(
        arrayBuffer
      );
      setAudioUnlocked(true);
    } catch { }
  }, [isAuthenticated]);

  const playAzan = useCallback(async () => {
    if (
      !audioBufferRef.current ||
      !audioCtxRef.current ||
      isMuted ||
      !isAuthenticated
    )
      return;
    if (audioCtxRef.current.state === "suspended")
      await audioCtxRef.current.resume();
    const source = audioCtxRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(audioCtxRef.current.destination);
    source.start(0);
    setIsPlaying(true);
    source.onended = () => setIsPlaying(false);
  }, [isMuted, isAuthenticated]);

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated) {
      setUsername("Guest");
      setIsMuted(true);
      return;
    }
    try {
      const data = await fetchProfileMe(token);
      setUsername(data.username || "User");
      setIsMuted(!!data.muted);
      if (data.latitude && data.longitude) {
        setUseProfileLocation(true);
        const state = data.state || data.city || "Unknown";
        const country = data.country || "";
        setUserLocation(`${state}, ${country}`.replace(/,\s*$/, ""));
      }
    } catch {
      setUsername("Guest");
      setIsMuted(true);
    }
  }, [isAuthenticated, token]);

  const toggleMute = async () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (!isAuthenticated) return;
    try {
      await updateMuteStatus(newMuted, token);
    } catch {
      setIsMuted(!newMuted);
    }
  };

  const getPosition = () =>
    new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        () =>
          resolve({
            latitude: DEFAULT_LAT,
            longitude: DEFAULT_LON,
            error: true,
          }),
        { enableHighAccuracy: false, timeout: 10000 }
      );
    });

  const fetchLocationName = useCallback(async (lat, lon) => {
    setUserLocation("Fetching location name...");
    try {
      const data = await fetchReverseGeocode(lat, lon);
      const address = data.address || {};
      const state =
        address.state ||
        address.county ||
        data.display_name?.split(",")[0] ||
        "Unknown";
      const country = address.country || "";
      setUserLocation(`${state}, ${country}`.replace(/,\s*$/, ""));
    } catch {
      setUserLocation("Location unavailable");
    }
  }, []);

  const startCountdown = (nextPrayer) => {
    if (!nextPrayer?.timestamp) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const update = () => {
      const now = Date.now();
      const diff = nextPrayer.timestamp * 1000 - now;
      if (diff <= 0) {
        setCountdown("It's time for prayer!");
        if (
          lastPrayerRef.current !== nextPrayer.name &&
          audioUnlocked &&
          !isMuted &&
          isAuthenticated
        ) {
          playAzan();
          lastPrayerRef.current = nextPrayer.name;
        }
        clearInterval(timerRef.current);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
          .toString()
          .padStart(2, "0")}`
      );
    };
    update();
    timerRef.current = setInterval(update, 1000);
  };

  const fetchPrayerTimes = useCallback(async () => {
    let lat = DEFAULT_LAT;
    let lon = DEFAULT_LON;

    try {
      if (isAuthenticated && useProfileLocation) {
        const user = await fetchProfileMe(token);
        if (user.latitude && user.longitude) {
          lat = user.latitude;
          lon = user.longitude;
          const state = user.state || user.city || "Unknown";
          const country = user.country || "";
          setUserLocation(`${state}, ${country}`.replace(/,\s*$/, ""));
        }
      }

      if (!useProfileLocation || !isAuthenticated) {
        const pos = await getPosition();
        lat = pos.latitude;
        lon = pos.longitude;
        if (pos.error) setUserLocation("Ibadan, Nigeria");
        else await fetchLocationName(lat, lon);

        // On login, persist the detected location to the profile so it shows in profile & future prayers.
        if (isAuthenticated && !pos.error) {
          try {
            const reverse = await fetchReverseGeocode(lat, lon);
            const address = reverse.address || {};
            await updateProfileLocation(
              {
                latitude: lat,
                longitude: lon,
                city: address.city || address.town || address.village || "",
                state: address.state || address.county || "",
                country: address.country || "",
              },
              token
            );
          } catch (err) {
            console.warn("Failed to persist location", err);
          }
        }
      }

      const data = await fetchPrayerTimesApi(lat, lon, token);
      setPrayerData(data);
      startCountdown(data.next_prayer);
    } catch {
      if (!prayerData) setPrayerData({ next_prayer: null, prayer_times: {} });
      setUserLocation("Data Unavailable");
    }
  }, [
    isAuthenticated,
    token,
    useProfileLocation,
    fetchLocationName,
    audioUnlocked,
    isMuted,
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadAudio();
    fetchUserData();
    fetchPrayerTimes();
    const interval = setInterval(fetchPrayerTimes, 60000);
    return () => {
      clearInterval(interval);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchPrayerTimes, fetchUserData, loadAudio]);

  const formatDate = () =>
    currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const formatTime = () =>
    currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const prayerIcons = {
    Fajr: "Pre-dawn",
    Sunrise: "Sunrise",
    Dhuhr: "Midday",
    Asr: "Afternoon",
    Maghrib: "Sunset",
    Isha: "Night",
  };

  const prayerDescriptions = {
    Fajr: "Dawn Prayer",
    Sunrise: "Sunrise Time",
    Dhuhr: "Noon Prayer",
    Asr: "Afternoon Prayer",
    Maghrib: "Sunset Prayer",
    Isha: "Night Prayer",
  };

  if (!prayerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 flex items-center justify-center">
        <LoadingSpinner fullScreen />
      </div>
    );
  }

  const next = prayerData.next_prayer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950">
      <header className="relative overflow-hidden text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white/10 animate-pulse"
              style={{ top: `${10 + i * 8}%`, left: `${5 + i * 11}%` }}
            >
              <svg
                className="w-12 h-12"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L15 8H21L16 12L18 18L12 14L6 18L8 12L3 8H9L12 2Z" />
              </svg>
            </div>
          ))}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 bg-white/10 backdrop-blur-lg rounded-full border-4 border-white/20 flex items-center justify-center shadow-2xl">
            <svg
              className="w-20 h-20 md:w-24 md:h-24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L15 8H21L16 12L18 18L12 14L6 18L8 12L3 8H9L12 2Z" />
            </svg>
          </div>
          <h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight"
            style={{ fontFamily: "Amiri, Georgia, serif" }}
          >
            Prayer Times
          </h1>
          <p className="mt-4 text-2xl md:text-3xl text-emerald-200 font-medium">
            Establish Salah • Strengthen Iman
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-white border border-white/20">
            <div className="flex items-center gap-4">
              <MapPin className="w-8 h-8" />
              <div>
                <p className="text-white/70 text-sm">Location</p>
                <p className="text-xl font-bold">{userLocation}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-white border border-white/20">
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8" />
              <div>
                <p className="text-white/70 text-sm">Current Time</p>
                <p className="text-xl font-bold">{formatTime()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-white border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8" />
                <div>
                  <p className="text-white/70 text-sm">Date</p>
                  <p className="text-lg font-bold">{formatDate()}</p>
                </div>
              </div>
              <button
                onClick={toggleMute}
                className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition"
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {prayerData.hijri_date && (
          <div className="text-center mb-8 text-white/90 text-lg font-medium tracking-wider">
            {prayerData.hijri_date}
          </div>
        )}

        {next && (
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-8 mb-10 text-white text-center shadow-2xl">
            <p className="text-2xl font-light opacity-90">Next Prayer</p>
            <h2 className="text-6xl font-extrabold mt-3">{next.name}</h2>
            <p className="text-4xl font-bold mt-4">
              {next.time_12h || next.time}
            </p>
            <p className="text-3xl mt-6 font-mono tracking-wider">
              {countdown}
            </p>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
          {Object.entries(prayerData.prayer_times).map(([name, info], i) => {
            const isNext = name === next?.name;
            return (
              <div
                key={name}
                className={`px-8 py-7 flex items-center justify-between border-b border-white/10 last:border-0 ${isNext ? "bg-white/20" : ""
                  }`}
              >
                <div className="flex items-center gap-6">
                  <span className="text-5xl">{prayerIcons[name]}</span>
                  <div>
                    <h3
                      className={`text-2xl font-bold text-white ${isNext ? "text-amber-300" : ""
                        }`}
                    >
                      {name}
                    </h3>
                    <p className="text-white/70 text-sm mt-1">
                      {prayerDescriptions[name]}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-3xl font-extrabold ${isNext ? "text-amber-300" : "text-white"
                      }`}
                  >
                    {info.time_12h || info.time}
                  </p>
                  {isNext && (
                    <span className="inline-block mt-2 px-5 py-2 bg-amber-500/30 rounded-full text-amber-200 text-sm font-bold">
                      Next Prayer
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-2xl md:text-3xl font-bold text-white italic">
            "Indeed, prayer has been decreed upon the believers a decree of
            specified times."
          </p>
          <p className="text-amber-300 mt-3 text-lg">— Quran 4:103</p>
        </div>
      </div>
    </div>
  );
}

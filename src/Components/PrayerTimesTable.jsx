import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Clock,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  MapPin,
  User,
  Calendar,
} from "lucide-react";

export default function PrayerTimesTable() {
  const [prayerData, setPrayerData] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [userLocation, setUserLocation] = useState("Fetching location...");
  const [username, setUsername] = useState("Guest");
  const [useProfileLocation, setUseProfileLocation] = useState(true);
  const timerRef = useRef(null);
  const lastPrayerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const audioBufferRef = useRef(null);
  const BACKEND_URL = "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  const loadAudio = useCallback(async () => {
    if (!token) return;
    if (!audioCtxRef.current)
      audioCtxRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    if (audioBufferRef.current) return;
    try {
      const res = await fetch(`${BACKEND_URL}/static/audio/azan1.mp3`);
      const arrayBuffer = await res.arrayBuffer();
      audioBufferRef.current = await audioCtxRef.current.decodeAudioData(
        arrayBuffer
      );
      setAudioUnlocked(true);
    } catch {}
  }, [token]);

  const playAzan = useCallback(async () => {
    if (!token) return;
    if (isMuted || !audioBufferRef.current || !audioCtxRef.current) return;
    if (audioCtxRef.current.state === "suspended") {
      await audioCtxRef.current.resume();
    }
    const source = audioCtxRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(audioCtxRef.current.destination);
    source.start(0);
    setIsPlaying(true);
    source.onended = () => setIsPlaying(false);
  }, [isMuted, token]);

  const fetchUserData = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/prayers/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setUsername(data.username || "Guest");
      if (useProfileLocation) {
        const state = data.state || data.city || "Unknown";
        const country = data.country || "";
        setUserLocation(`${state}, ${country}`);
      }
    } catch {}
  }, [token, useProfileLocation]);

  const toggleMute = async () => {
    if (!token) return;
    try {
      const endpoint = isMuted ? "unmute" : "mute";
      const res = await fetch(`${BACKEND_URL}/prayers/users/me/${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setIsMuted(data.muted);
    } catch {}
  };

  const getPosition = () =>
    new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        () => resolve({ latitude: 7.3775, longitude: 3.947 }),
        { enableHighAccuracy: false, timeout: 10000 }
      );
    });

  const fetchLocationName = useCallback(async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      const state = data.address?.state || data.address?.county || "Unknown";
      const country = data.address?.country || "";
      setUserLocation(`${state}, ${country}`);
    } catch {
      setUserLocation("Location unavailable");
    }
  }, []);

  const fetchPrayerTimes = useCallback(async () => {
    if (!token) return;
    try {
      let lat, lon;
      if (useProfileLocation && token) {
        const res = await fetch(`${BACKEND_URL}/prayers/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          lat = data.latitude || 7.3775;
          lon = data.longitude || 3.947;
          const state = data.state || data.city || "Unknown";
          const country = data.country || "";
          setUserLocation(`${state}, ${country}`);
        }
      } else {
        const pos = await getPosition();
        lat = pos.latitude;
        lon = pos.longitude;
        fetchLocationName(lat, lon);
      }

      if (!lat || !lon) return;

      const res = await fetch(
        `${BACKEND_URL}/prayers/times?lat=${lat}&lon=${lon}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return;
      const data = await res.json();
      setPrayerData(data);
      startCountdown(data.next_prayer);

      const currentNext = data.next_prayer?.name;
      if (lastPrayerRef.current !== currentNext && audioUnlocked && !isMuted) {
        playAzan();
        lastPrayerRef.current = currentNext;
      }
    } catch {}
  }, [
    token,
    useProfileLocation,
    fetchLocationName,
    audioUnlocked,
    isMuted,
    playAzan,
  ]);

  const startCountdown = (nextPrayer) => {
    if (!nextPrayer?.timestamp) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const update = () => {
      const now = Date.now();
      const diff = nextPrayer.timestamp * 1000 - now;
      if (diff <= 0) {
        setCountdown("It's time!");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${h}h ${m}m ${s}s`);
    };
    update();
    timerRef.current = setInterval(update, 1000);
  };

  useEffect(() => {
    if (!token) return;
    loadAudio();
    fetchUserData();
    fetchPrayerTimes();
    const interval = setInterval(fetchPrayerTimes, 60000);
    return () => {
      clearInterval(timerRef.current);
      clearInterval(interval);
    };
  }, [
    isMuted,
    useProfileLocation,
    fetchPrayerTimes,
    fetchUserData,
    loadAudio,
    token,
  ]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md text-center">
          <p className="text-gray-600 text-base mb-3">
            Please login to view accurate prayer times for your location.
          </p>
          <a
            href="/login?next=/prayer-times"
            className="text-emerald-600 hover:text-emerald-700 font-medium underline transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (!prayerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex justify-center items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-emerald-600 absolute top-0"></div>
          </div>
        </div>
      </div>
    );
  }

  const next = prayerData.next_prayer;
  const prayerIcons = {
    Fajr: <Sun size={18} className="text-amber-500" />,
    Dhuhr: <Sun size={18} className="text-yellow-500" />,
    Asr: <Sun size={18} className="text-orange-500" />,
    Maghrib: <Moon size={18} className="text-purple-500" />,
    Isha: <Moon size={18} className="text-indigo-500" />,
  };

  return (
    <div className="min-h-screen bg-white py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Prayer Times
            </h1>
            <div className="flex items-center gap-3 text-gray-500 text-xs">
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>{username}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{userLocation}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{prayerData.hijri_date}</span>
              </div>
            </div>
          </div>
          <button
            onClick={toggleMute}
            className="relative p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-gray-600" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-600" />
            )}
            {isPlaying && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </button>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between text-white">
            <div>
              <div className="flex items-center gap-1.5 mb-1 opacity-90">
                <Clock className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide font-medium">
                  Next Prayer
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl font-bold">{next?.name || "—"}</h2>
                <span className="text-2xl font-light opacity-90">
                  {next?.time_12h || "--:--"}
                </span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2.5 rounded-lg">
              <div className="text-center">
                <div className="text-xs opacity-80 mb-0.5">Remaining</div>
                <div className="text-xl font-bold tabular-nums">
                  {countdown}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={useProfileLocation}
                onChange={() => setUseProfileLocation(!useProfileLocation)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </div>
            <span className="text-xs text-gray-600">Use profile location</span>
          </label>
        </div>

        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-xs uppercase tracking-wide">
                  Prayer
                </th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold text-xs uppercase tracking-wide">
                  Time
                </th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold text-xs uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(prayerData.prayer_times).map(([name, info]) => (
                <tr
                  key={name}
                  className={`transition-colors ${
                    name === next?.name ? "bg-emerald-50" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-lg ${
                          name === next?.name ? "bg-emerald-100" : "bg-gray-100"
                        }`}
                      >
                        {prayerIcons[name] || (
                          <Clock size={18} className="text-gray-500" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          name === next?.name
                            ? "text-emerald-700"
                            : "text-gray-800"
                        }`}
                      >
                        {name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div
                      className={`text-right text-lg font-bold tabular-nums ${
                        name === next?.name
                          ? "text-emerald-600"
                          : "text-gray-800"
                      }`}
                    >
                      {info.time_12h || info.time}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {name === next?.name ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 rounded-full">
                        <span className="flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600"></span>
                        </span>
                        <span className="text-emerald-700 text-xs font-medium">
                          Active
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-center text-gray-500 text-xs">
          <p>{prayerData.gregorian_date}</p>
        </div>
      </div>
    </div>
  );
}

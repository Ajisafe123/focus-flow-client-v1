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
  Zap,
} from "lucide-react";

const DEFAULT_LAT = 7.3775;
const DEFAULT_LON = 3.947;

export default function PrayerTimesTable() {
  const [prayerData, setPrayerData] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [userLocation, setUserLocation] = useState("Fetching location...");
  const [username, setUsername] = useState("Guest");
  const [useProfileLocation, setUseProfileLocation] = useState(false);
  const timerRef = useRef(null);
  const lastPrayerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const audioBufferRef = useRef(null);

  const LOCAL_BACKEND_URL = "https://focus-flow-server-v1.onrender.com";
  const BACKEND_URL = LOCAL_BACKEND_URL;

  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const loadAudio = useCallback(async () => {
    if (!isAuthenticated) {
      setAudioUnlocked(false);
      return;
    }
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
    } catch (error) {
      console.error("Error loading Azan audio:", error);
    }
  }, [isAuthenticated, BACKEND_URL]);

  const playAzan = useCallback(async () => {
    if (!isAuthenticated) return;
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
  }, [isMuted, isAuthenticated]);

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated) {
      setUsername("Guest");
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/prayers/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setUsername("Guest");
        return;
      }
      const data = await res.json();
      setUsername(data.username || "User");
      setIsMuted(data.muted);

      if (data.latitude && data.longitude) {
        setUseProfileLocation(true);
        const state = data.state || data.city || "Unknown";
        const country = data.country || "";
        setUserLocation(`${state}, ${country}`);
      } else {
        setUseProfileLocation(false);
      }
    } catch {
      setUsername("Guest");
    }
  }, [isAuthenticated, token, BACKEND_URL]);

  const toggleMute = async () => {
    if (!isAuthenticated) {
      setIsMuted((prev) => !prev);
      return;
    }
    try {
      const endpoint = isMuted ? "unmute" : "mute";
      const res = await fetch(`${BACKEND_URL}/prayers/users/me/${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setIsMuted(data.muted);
    } catch (error) {
      console.error("Failed to toggle mute:", error);
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

  const fetchLocationName = useCallback(
    async (lat, lon) => {
      setUserLocation("Fetching location name...");
      try {
        const res = await fetch(
          `${BACKEND_URL}/prayers/reverse-geocode?lat=${lat}&lon=${lon}`
        );
        if (!res.ok) throw new Error("Proxy failed");
        const data = await res.json();
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
    },
    [BACKEND_URL]
  );

  const startCountdown = (nextPrayer) => {
    if (!nextPrayer?.timestamp) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const update = () => {
      const now = Date.now();
      const diff = nextPrayer.timestamp * 1000 - now;
      if (diff <= 0) {
        setCountdown("It's time!");
        if (
          lastPrayerRef.current !== nextPrayer.name &&
          audioUnlocked &&
          !isMuted
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
      setCountdown(`${h}h ${m}m ${s}s`);
    };
    update();
    timerRef.current = setInterval(update, 1000);
  };

  const fetchPrayerTimes = useCallback(async () => {
    let lat = DEFAULT_LAT;
    let lon = DEFAULT_LON;
    let locationSet = false;

    try {
      if (isAuthenticated) {
        const userRes = await fetch(`${BACKEND_URL}/prayers/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (useProfileLocation && userData.latitude && userData.longitude) {
            lat = userData.latitude;
            lon = userData.longitude;
            const state = userData.state || userData.city || "Unknown";
            const country = userData.country || "";
            setUserLocation(`${state}, ${country}`.replace(/,\s*$/, ""));
            locationSet = true;
          }
        }
      }

      if (!locationSet && !useProfileLocation) {
        const pos = await getPosition();
        lat = pos.latitude;
        lon = pos.longitude;
        if (pos.error) {
          setUserLocation("Ibadan, Nigeria (Geolocation Failed)");
        } else {
          await fetchLocationName(lat, lon);
        }
        locationSet = true;
      }

      if (!locationSet && !isAuthenticated) {
        setUserLocation("Ibadan, Nigeria (Default)");
        locationSet = true;
      }

      const headers = isAuthenticated
        ? { Authorization: `Bearer ${token}` }
        : {};
      const res = await fetch(
        `${BACKEND_URL}/prayers/times?lat=${lat}&lon=${lon}`,
        { headers: headers }
      );

      if (!res.ok) throw new Error("Failed to fetch prayer data");

      const data = await res.json();
      setPrayerData(data);
      startCountdown(data.next_prayer);
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      if (!prayerData) setPrayerData({ next_prayer: null, prayer_times: {} });
      setUserLocation("Data Unavailable");
    }
  }, [
    isAuthenticated,
    token,
    useProfileLocation,
    fetchLocationName,
    BACKEND_URL,
  ]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    let interval;
    loadAudio();
    fetchUserData();
    fetchPrayerTimes();
    interval = setInterval(fetchPrayerTimes, 60000);
    return () => {
      clearInterval(timerRef.current);
      clearInterval(interval);
    };
  }, [
    isAuthenticated,
    isMuted,
    useProfileLocation,
    fetchPrayerTimes,
    fetchUserData,
    loadAudio,
  ]);

  const handleToggleProfileLocation = (e) => {
    setUseProfileLocation(e.target.checked);
  };

  if (!prayerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex justify-center items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-600 absolute top-0 left-0"></div>
          </div>
        </div>
      </div>
    );
  }

  const next = prayerData.next_prayer;
  const prayerIcons = {
    Fajr: <Sun size={16} className="text-yellow-500" />,
    Sunrise: <Zap size={16} className="text-orange-400" />,
    Dhuhr: <Sun size={16} className="text-orange-500" />,
    Asr: <Sun size={16} className="text-amber-600" />,
    Maghrib: <Moon size={16} className="text-blue-500" />,
    Isha: <Moon size={16} className="text-indigo-600" />,
  };

  return (
    <div className="min-h-screen bg-white py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {!isAuthenticated && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg flex items-center justify-between mb-5 shadow-sm text-sm">
            <p>Log in to use your profile location and enable Azan playback.</p>
            <a
              href="/login?next=/prayer-times"
              className="text-emerald-600 hover:text-emerald-700 font-medium underline shrink-0 ml-4"
            >
              Login
            </a>
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 text-gray-500 text-sm">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{username}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{userLocation}</span>
              </div>
            </div>
          </div>
          <button
            onClick={toggleMute}
            className={`relative p-2 bg-white hover:bg-emerald-50 rounded-lg transition-colors border ${
              isAuthenticated
                ? "border-emerald-300"
                : "border-gray-200 cursor-not-allowed"
            }`}
            disabled={!isAuthenticated}
            title={!isAuthenticated ? "Login to control Azan playback" : ""}
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
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-4 mb-4 shadow-md">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 opacity-90" />
              <span className="text-sm font-medium">
                Next: {next?.name || "—"}
              </span>
            </div>
            <div className="text-2xl font-bold tabular-nums">
              {next?.time_12h || "--:--"}
            </div>
          </div>
          <div className="flex justify-between items-center text-white mt-2 border-t border-emerald-400 pt-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4 opacity-90" />
              <span>{prayerData.hijri_date}</span>
            </div>
            <div className="text-sm font-medium">
              <span className="font-bold tabular-nums">{countdown}</span>
            </div>
          </div>
        </div>
        {isAuthenticated && (
          <div className="mb-4 flex items-center gap-2.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={useProfileLocation}
                  onChange={handleToggleProfileLocation}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </div>
              <span className="text-sm text-gray-600">
                Use profile location for calculation
              </span>
            </label>
          </div>
        )}
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md">
          <table className="w-full">
            <tbody className="divide-y divide-gray-100">
              {Object.entries(prayerData.prayer_times).map(([name, info]) => (
                <tr
                  key={name}
                  className={`transition-colors ${
                    name === next?.name ? "bg-emerald-50" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-lg ${
                          name === next?.name ? "bg-emerald-100" : "bg-gray-100"
                        }`}
                      >
                        {prayerIcons[name] || (
                          <Clock size={16} className="text-gray-500" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          name === next?.name
                            ? "text-emerald-800"
                            : "text-gray-800"
                        }`}
                      >
                        {name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div
                      className={`text-right text-lg font-bold tabular-nums ${
                        name === next?.name
                          ? "text-emerald-700"
                          : "text-gray-800"
                      }`}
                    >
                      {info.time_12h || info.time}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end">
                      <input
                        type="checkbox"
                        checked={name === next?.name}
                        readOnly
                        className={`w-5 h-5 border rounded-md cursor-pointer ${
                          name === next?.name
                            ? "bg-emerald-600 border-emerald-600"
                            : "border-gray-300 bg-white"
                        }`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from "react";
import {
  Moon,
  Star,
  Calendar,
  Clock,
  Book,
  Heart,
  Utensils,
  BookOpen,
  ChevronRight,
  Check,
  Plus,
  Minus,
  X,
  Search,
  Share2,
} from "lucide-react";

const RAMADAN_STATS = [
  { icon: Calendar, value: "30", label: "Days of Blessing", color: "emerald" },
  { icon: Moon, value: "5", label: "Pillars of Islam", color: "emerald" },
  { icon: Star, value: "1000+", label: "Rewards Multiplied", color: "emerald" },
  { icon: Heart, value: "infinity", label: "Mercy of Allah", color: "emerald" },
];

const DAILY_SCHEDULE = [
  {
    time: "4:30 AM",
    title: "Suhoor (Pre-dawn meal)",
    desc: "Wake up early and have your last meal before fasting begins",
    icon: Utensils,
    color: "emerald",
  },
  {
    time: "5:15 AM",
    title: "Fajr Prayer",
    desc: "Perform the dawn prayer and make dua",
    icon: Moon,
    color: "emerald",
  },
  {
    time: "Morning",
    title: "Quran Recitation",
    desc: "Recite and reflect on the Quran throughout the day",
    icon: BookOpen,
    color: "emerald",
  },
  {
    time: "7:30 PM",
    title: "Iftar (Breaking fast)",
    desc: "Break your fast with dates and water, then pray Maghrib",
    icon: Utensils,
    color: "emerald",
  },
  {
    time: "9:00 PM",
    title: "Taraweeh Prayer",
    desc: "Special night prayers performed during Ramadan",
    icon: Star,
    color: "emerald",
  },
  {
    time: "11:00 PM",
    title: "Night Worship",
    desc: "Engage in extra prayers, dhikr, and dua",
    icon: Star,
    color: "emerald",
  },
];

const GOOD_DEEDS = [
  {
    id: 1,
    title: "Complete Quran Reading",
    desc: "Read the entire Quran during Ramadan",
    icon: BookOpen,
    target: 30,
    unit: "Juz",
  },
  {
    id: 2,
    title: "Feed the Fasting",
    desc: "Provide iftar meals to others",
    icon: Utensils,
    target: 10,
    unit: "Meals",
  },
  {
    id: 3,
    title: "Night Prayers",
    desc: "Perform Taraweeh every night",
    icon: Moon,
    target: 30,
    unit: "Nights",
  },
  {
    id: 4,
    title: "Acts of Charity",
    desc: "Give sadaqah and help those in need",
    icon: Heart,
    target: 20,
    unit: "Acts",
  },
  {
    id: 5,
    title: "Make Dua",
    desc: "Consistent supplication to Allah",
    icon: Star,
    target: 30,
    unit: "Days",
  },
  {
    id: 6,
    title: "Seek Laylatul Qadr",
    desc: "Worship in the last 10 nights",
    icon: Moon,
    target: 10,
    unit: "Nights",
  },
];

const TARGET_RAMADAN = new Date("2026-03-20T00:00:00");

function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    const calc = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return { days, hours, minutes, seconds };
    };
    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return timeLeft;
}

const GoodDeedsTracker = () => {
  const [progress, setProgress] = useState({});
  const [modal, setModal] = useState(null);
  useEffect(() => {
    const raw = localStorage.getItem("ramadan-progress");
    if (raw) setProgress(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem("ramadan-progress", JSON.stringify(progress));
  }, [progress]);
  const update = (id, delta) => {
    setProgress((prev) => {
      const cur = prev[id] ?? 0;
      const deed = GOOD_DEEDS.find((d) => d.id === id);
      return { ...prev, [id]: Math.max(0, Math.min(cur + delta, deed.target)) };
    });
  };
  const shareProgress = () => {
    const lines = GOOD_DEEDS.map(
      (d) => `${d.title}: ${progress[d.id] ?? 0}/${d.target} ${d.unit}`
    ).join("\n");
    navigator.clipboard.writeText(lines);
    alert("Progress copied!");
  };
  return (
    <>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        {GOOD_DEEDS.map((deed) => {
          const Icon = deed.icon;
          const cur = progress[deed.id] ?? 0;
          const pct = (cur / deed.target) * 100;
          const done = cur >= deed.target;
          return (
            <div
              key={deed.id}
              onClick={() => setModal(deed)}
              className="group bg-white rounded-2xl p-4 sm:p-5 cursor-pointer border-2 border-emerald-100 hover:border-emerald-600 transition-all hover:shadow-lg hover:shadow-emerald-100/50"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${
                    done
                      ? "from-emerald-600 to-teal-600"
                      : "from-emerald-600 to-teal-600"
                  } shadow-md`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {done && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Done
                  </span>
                )}
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                {deed.title}
              </h3>
              <p className="text-xs text-emerald-700 mt-1">{deed.desc}</p>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-emerald-700">
                    {cur}/{deed.target} {deed.unit}
                  </span>
                  <span className="text-emerald-600">{pct.toFixed(0)}%</span>
                </div>
                <div className="h-2.5 bg-emerald-50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      done
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600"
                        : "bg-gradient-to-r from-emerald-600 to-teal-600"
                    }`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
              <div
                className="flex gap-2 mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => update(deed.id, -1)}
                  className="flex-1 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-sm transition flex items-center justify-center gap-1"
                >
                  <Minus className="w-3.5 h-3.5" />-
                </button>
                <button
                  onClick={() => update(deed.id, +1)}
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium text-sm transition flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />+
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={shareProgress}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition shadow-md"
        >
          <Share2 className="w-4 h-4" /> Share Progress
        </button>
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-7">
            <div className="flex justify-between items-start mb-5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600">
                {React.createElement(modal.icon, {
                  className: "w-8 h-8 text-white",
                })}
              </div>
              <button
                onClick={() => setModal(null)}
                className="p-1.5 hover:bg-emerald-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-emerald-700" />
              </button>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{modal.title}</h3>
            <p className="mt-2 text-emerald-700">{modal.desc}</p>
            <div className="mt-6 bg-emerald-50 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-emerald-700">Progress</span>
                <span className="font-bold text-emerald-700">
                  {progress[modal.id] ?? 0} / {modal.target}
                </span>
              </div>
              <div className="h-4 bg-emerald-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-500"
                  style={{
                    width: `${
                      ((progress[modal.id] ?? 0) / modal.target) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
            <p className="mt-5 text-sm text-emerald-700">
              <strong>Tip:</strong> Small steps daily lead to great rewards in
              Ramadan.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default function RamadanDashboard() {
  const [scheduleSearch, setScheduleSearch] = useState("");
  const timeLeft = useCountdown(TARGET_RAMADAN);
  const filteredSchedule = useMemo(() => {
    if (!scheduleSearch) return DAILY_SCHEDULE;
    const term = scheduleSearch.toLowerCase();
    return DAILY_SCHEDULE.filter(
      (i) =>
        i.title.toLowerCase().includes(term) ||
        i.desc.toLowerCase().includes(term)
    );
  }, [scheduleSearch]);
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-16 md:py-24 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-30">
          {[...Array(8)].map((_, i) => (
            <Star
              key={i}
              className="absolute w-8 h-8 animate-pulse text-white/50"
              style={{ top: `${5 + i * 12}%`, left: `${5 + i * 14}%` }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white flex-shrink-0 mx-auto mb-6">
            <Moon className="w-12 h-12 md:w-16 md:h-16 text-white" />
          </div>
          <h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight"
            style={{ fontFamily: "Amiri, serif" }}
          >
            Ramadan Kareem
          </h1>
          <p className="mt-3 text-xl md:text-2xl text-emerald-100">
            The Month of Mercy, Forgiveness & Salvation
          </p>
          <p
            className="mt-1 text-emerald-200 text-lg"
            style={{ fontFamily: "Amiri, serif" }}
          >
            ramadan mubarak
          </p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-20">
        <section className="bg-white rounded-3xl p-8 md:p-10 text-center border border-gray-100 shadow-xl">
          <Moon className="w-14 h-14 md:w-20 md:h-20 mx-auto mb-4 text-emerald-600" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Ramadan Begins In
          </h2>
          <p className="text-emerald-600 mt-2">Prepare your heart and soul</p>
          <div className="grid grid-cols-2 xs:grid-cols-4 gap-4 mt-8">
            {Object.entries(timeLeft).map(([k, v]) => (
              <div
                key={k}
                className="bg-emerald-50 rounded-2xl p-4 md:p-5 border border-emerald-100"
              >
                <div className="text-3xl md:text-5xl font-extrabold text-emerald-700">
                  {String(v).padStart(2, "0")}
                </div>
                <div className="text-xs md:text-sm font-medium text-emerald-600 uppercase mt-1">
                  {k}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
          {RAMADAN_STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 sm:p-6 text-center border border-gray-100 hover:border-emerald-600 transition-all hover:shadow-lg hover:shadow-emerald-100/50"
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-50 flex items-center justify-center shadow-md">
                  <Icon className="w-7 h-7 text-emerald-600" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-gray-900">
                  {s.value}
                </div>
                <div className="text-sm text-emerald-700 mt-1">{s.label}</div>
              </div>
            );
          })}
        </section>
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Daily{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Ramadan Schedule
              </span>
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              <input
                type="text"
                placeholder="Search..."
                value={scheduleSearch}
                onChange={(e) => setScheduleSearch(e.target.value)}
                className="pl-11 pr-4 py-3 rounded-lg border-2 border-white/30 focus:border-white bg-white text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
              />
            </div>
          </div>
          <div className="space-y-4">
            {filteredSchedule.map((item, idx) => {
              const Icon = item.icon;
              return (
                <details
                  key={idx}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100"
                >
                  <summary className="flex items-center gap-5 p-5 cursor-pointer list-none">
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-md">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                        <Clock className="w-4 h-4" />
                        {item.time}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-1">
                        {item.title}
                      </h3>
                    </div>
                    <ChevronRight className="w-6 h-6 text-emerald-500 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-5 pb-5 pt-3 border-t border-gray-100">
                    <p className="text-emerald-700">{item.desc}</p>
                  </div>
                </details>
              );
            })}
          </div>
        </section>
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
            Track Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Good Deeds
            </span>
          </h2>
          <GoodDeedsTracker />
        </section>
        <section className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-10 md:p-14 text-white text-center shadow-2xl">
          <details className="group list-none">
            <summary className="cursor-pointer flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 justify-center mb-5">
                <ChevronRight className="w-6 h-6 ml-2 transition-transform group-open:rotate-90" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                May Allah Accept Your Worship
              </h3>
            </summary>
            <div className="pt-6">
              <p className="text-lg md:text-xl text-emerald-100 max-w-4xl mx-auto leading-relaxed">
                "The month of Ramadan in which was revealed the Quran, a
                guidance for mankind and clear proofs for the guidance and the
                criterion (between right and wrong)."
              </p>
              <p
                className="mt-3 text-emerald-200"
                style={{ fontFamily: "Amiri, serif" }}
              >
                Surah Al-Baqarah (2:185)
              </p>
            </div>
          </details>
        </section>
      </main>
      <footer className="bg-white text-gray-600 py-6 mt-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-light">
            Nibras copyright {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

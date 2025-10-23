import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function IslamicCalendar() {
  const [today, setToday] = useState({ gregorian: "", hijri: "" });
  const [monthDates, setMonthDates] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [hijriMonth, setHijriMonth] = useState("");
  const [hijriYear, setHijriYear] = useState("");

  useEffect(() => {
    fetchToday();
    fetchMonth(month, year);
  }, [month, year]);

  const fetchToday = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/calendar/today");
      const data = await res.json();
      setToday(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMonth = async (month, year) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/calendar/month?month=${month}&year=${year}`
      );
      const data = await res.json();
      const startDay = new Date(year, month - 1, 1).getDay();
      const blanks = Array.from({ length: startDay }, () => ({ blank: true }));
      setMonthDates([...blanks, ...data.days]);

      if (data.days.length) {
        const [hMonth, hYear] = data.days[0].hijri.split(" ");
        setHijriMonth(hMonth);
        setHijriYear(hYear);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else setMonth(month - 1);
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else setMonth(month + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-3 sm:p-6">
      <div className="max-w-5xl mx-auto flex flex-col">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Islamic Calendar
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            Dual Calendar View - Gregorian & Hijri
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 sm:mb-6">
          <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-500 shadow-md">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              Today (Gregorian)
            </p>
            <p className="text-lg sm:text-xl font-bold text-emerald-700">
              {today.gregorian}
            </p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-500 shadow-md">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              Today (Hijri)
            </p>
            <p className="text-lg sm:text-xl font-bold text-teal-700">
              {today.hijri}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 sm:mb-6 gap-2 sm:gap-4 bg-white rounded-xl shadow p-2 sm:p-3">
          <button
            onClick={handlePrevMonth}
            className="flex items-center justify-center w-10 h-10 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <p className="text-lg sm:text-2xl font-bold text-gray-800">
              {MONTH_NAMES[month - 1]} {year}
            </p>
            <p className="text-sm sm:text-base text-teal-600 font-medium">
              {hijriMonth} {hijriYear}
            </p>
          </div>

          <button
            onClick={handleNextMonth}
            className="flex items-center justify-center w-10 h-10 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {["Gregorian", "Hijri"].map((cal) => (
            <div
              key={cal}
              className="bg-white rounded-xl shadow p-3 sm:p-4 border-2 border-green-500"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 text-center mb-2">
                {cal} Calendar
              </h3>
              <div className="grid grid-cols-7 gap-1 text-xs sm:text-sm font-bold text-gray-700 text-center mb-1 sm:mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {monthDates.map((day, idx) =>
                  day.blank ? (
                    <div key={idx} className="aspect-square"></div>
                  ) : (
                    <div
                      key={idx}
                      className={`aspect-square flex items-center justify-center rounded-xl border-2 cursor-pointer transition-all
                      ${
                        cal === "Gregorian"
                          ? today.gregorian === day.gregorian
                            ? "bg-emerald-500 text-white border-emerald-600 shadow-md scale-105"
                            : "border-green-500 hover:border-emerald-300 hover:bg-emerald-50"
                          : today.hijri === day.hijri
                          ? "bg-teal-500 text-white border-teal-600 shadow-md scale-105"
                          : "border-green-500 hover:border-teal-300 hover:bg-teal-50"
                      }`}
                    >
                      <span>
                        {cal === "Gregorian"
                          ? day.gregorian.split("-")[2]
                          : day.hijri.split(" ")[0]}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

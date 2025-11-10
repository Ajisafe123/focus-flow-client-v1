import React, { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

export default function DailyHadith() {
  const [hadith, setHadith] = useState(null);

  const fetchHadith = async () => {
    try {
      const res = await fetch(
        "https://focus-flow-server-v1.onrender.com/api/day"
      );
      if (!res.ok) throw new Error(`Failed to fetch hadith: ${res.status}`);
      const data = await res.json();
      setHadith(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchHadith();
  }, []);

  if (!hadith) {
    return (
      <div className="bg-gradient-to-b from-teal-50 to-emerald-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-emerald-600">
            <p className="text-center text-gray-500">Loading Hadith...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-b from-teal-50 to-emerald-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-emerald-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Hadith of the Day
              </h2>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 mb-4">
            <p className="text-gray-800 text-lg leading-relaxed mb-4 italic text-right">
              "{hadith.arabic}"
            </p>
            <p className="text-gray-700 text-md leading-relaxed mb-4">
              "{hadith.translation}"
            </p>
            {hadith.benefit && (
              <p className="text-green-700 text-sm leading-relaxed mb-4 font-medium">
                Benefit: {hadith.benefit}
              </p>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-emerald-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Narrated by:</span>{" "}
                {hadith.narrator}
              </p>
              <p className="text-sm text-emerald-700 font-semibold">
                {hadith.book || hadith.source}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-1.5">
            <div className="h-1.5 w-8 rounded-full bg-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

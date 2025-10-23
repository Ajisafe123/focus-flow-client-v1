import React from "react";
import { ArrowLeft } from "lucide-react";

export default function BackToWebsite() {
  return (
    <div className="text-center mt-6">
      <a
        href="/"
        className="inline-flex items-center space-x-2 text-white hover:text-emerald-200 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-semibold">Back to Website</span>
      </a>

      <p className="text-emerald-200 text-sm italic mt-6">
        "Indeed, prayer has been decreed upon the believers a decree of
        specified times." - An-Nisa 4:103
      </p>
    </div>
  );
}

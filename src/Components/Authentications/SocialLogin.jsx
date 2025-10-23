import React from "react";
import { Facebook } from "lucide-react";

export default function SocialLogin() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <button className="flex items-center justify-center space-x-2 py-3 px-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition">
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        <span className="text-sm font-semibold text-gray-700">Google</span>
      </button>

      <button className="flex items-center justify-center space-x-2 py-3 px-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition">
        <Facebook className="w-5 h-5 text-blue-600" />
        <span className="text-sm font-semibold text-gray-700">Facebook</span>
      </button>
    </div>
  );
}

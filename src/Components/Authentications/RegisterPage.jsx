import React from "react";
import { Link } from "react-router-dom";
import AuthForm from "./AuthForm";
import BackToWebsite from "./BackToWebsite";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white border border-emerald-100 shadow-2xl rounded-2xl">
        <div className="flex items-center justify-between px-5 pt-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-600 font-semibold">
              Register
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Create your account
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Join to access duas, lessons, and resources.
            </p>
          </div>
          <div className="hidden sm:block">
            <BackToWebsite />
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-700 mb-4">
            Use a valid email; we will send a quick verification link.
          </div>
          <AuthForm isLogin={false} />

          <div className="mt-6 text-center text-sm text-gray-600">
            <span>Already registered? </span>
            <Link
              to="/login"
              className="font-semibold text-emerald-700 hover:text-emerald-800 underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


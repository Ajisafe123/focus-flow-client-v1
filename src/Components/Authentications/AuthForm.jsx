import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, KeyRound } from "lucide-react";
import SocialLogin from "./SocialLogin";
import apiService from "../../Services/api";
import { useNavigate } from "react-router-dom";

export default function AuthForm({ isLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    identifier: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const MIN_LOADING_TIME = 1500;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleForgotPassword = () => navigate("/forgot-password");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const startTime = Date.now();

    try {
      if (isLogin) {
        const response = await apiService.login({
          identifier: formData.identifier,
          password: formData.password,
        });
        const token = response.token || response.access_token;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("role", response.role || "user"); 
          window.dispatchEvent(new Event("loginStatusChanged"));
        }
      } else {
        if (formData.password.length < 6)
          throw new Error("Password must be at least 6 characters");
        if (formData.password !== formData.confirmPassword)
          throw new Error("Passwords do not match");

        await apiService.register({
          username: formData.username,
          email: formData.identifier,
          password: formData.password,
        });
      }

      const elapsed = Date.now() - startTime;
      await new Promise((res) =>
        setTimeout(res, Math.max(0, MIN_LOADING_TIME - elapsed))
      );
      setFormData({
        username: "",
        identifier: "",
        password: "",
        confirmPassword: "",
      });
      navigate("/");
    } catch (err) {
      const elapsed = Date.now() - startTime;
      await new Promise((res) =>
        setTimeout(res, Math.max(0, MIN_LOADING_TIME - elapsed))
      );
      setError(err.message || "Invalid credentials or network issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5 sm:space-y-6">
      {!isLogin && (
        <div className="group animate-slideDown">
          <label className="block text-emerald-800 font-semibold mb-2 text-xs sm:text-sm tracking-wide uppercase">
            Username
          </label>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-600 transition-colors duration-200">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 text-gray-800 placeholder-gray-400 text-sm sm:text-base border border-transparent focus:border-emerald-300"
              placeholder="Choose a username"
              required={!isLogin}
            />
          </div>
        </div>
      )}

      <div className="group">
        <label className="block text-emerald-800 font-semibold mb-2 text-xs sm:text-sm tracking-wide uppercase">
          {isLogin ? "Email or Username" : "Email"}
        </label>
        <div className="relative">
          <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-600 transition-colors duration-200">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <input
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleInputChange}
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 text-gray-800 placeholder-gray-400 text-sm sm:text-base border border-transparent focus:border-emerald-300"
            placeholder={
              isLogin ? "your@email.com or username" : "your@email.com"
            }
            required
          />
        </div>
      </div>

      <div className="group">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-emerald-800 font-semibold text-xs sm:text-sm tracking-wide uppercase">
            Password
          </label>
          {isLogin && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs sm:text-sm text-teal-600 hover:text-teal-700 font-semibold hover:underline transition-all duration-200 flex items-center gap-1"
            >
              <KeyRound className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Forgot Password?
            </button>
          )}
        </div>
        <div className="relative">
          <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-600 transition-colors duration-200">
            <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-14 py-3 sm:py-4 bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 text-gray-800 placeholder-gray-400 text-sm sm:text-base border border-transparent focus:border-emerald-300"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors duration-200 p-1"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>

      {!isLogin && (
        <div className="group animate-slideDown">
          <label className="block text-emerald-800 font-semibold mb-2 text-xs sm:text-sm tracking-wide uppercase">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-600 transition-colors duration-200">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-14 py-3 sm:py-4 bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 text-gray-800 placeholder-gray-400 text-sm sm:text-base border border-transparent focus:border-emerald-300"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors duration-200 p-1"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 sm:px-4 py-3 rounded-xl text-xs sm:text-sm font-medium shadow-md animate-shake">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`relative w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-600 text-white py-3 sm:py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] text-base sm:text-lg tracking-wide overflow-hidden ${
          loading
            ? "opacity-90 cursor-not-allowed hover:translate-y-0 hover:scale-100"
            : ""
        }`}
      >
        {loading ? (
          <div className="flex items-center space-x-1 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <span className="ml-2">Processing...</span>
          </div>
        ) : isLogin ? (
          <>
            <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Sign In</span>
          </>
        ) : (
          <>
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Create Account</span>
          </>
        )}
      </button>

      <div className="relative my-6 sm:my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs sm:text-sm">
          <span className="px-3 sm:px-4 bg-gradient-to-b from-emerald-50 to-white text-gray-500 font-semibold">
            Or continue with
          </span>
        </div>
      </div>

      <SocialLogin />

      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%,100%{ transform:translateX(0);}25%{transform:translateX(-5px);}75%{transform:translateX(5px);} }
        @keyframes shimmer {0%{background-position:-200% center;}100%{background-position:200% center;}}
        .animate-slideDown{animation:slideDown 0.4s ease-out;}
        .animate-shake{animation:shake 0.4s ease-in-out;}
        .animate-shimmer{background-size:200% 100%;animation:shimmer 1.5s infinite;}
      `}</style>
    </form>
  );
}

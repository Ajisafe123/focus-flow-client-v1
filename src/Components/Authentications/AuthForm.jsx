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
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

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
          window.dispatchEvent(new Event("loginStatusChanged"));
        }

        const elapsed = Date.now() - startTime;
        await new Promise((res) =>
          setTimeout(res, Math.max(0, MIN_LOADING_TIME - elapsed))
        );

        navigate("/");
      } else {
        if (formData.password.length < 6) {
          const elapsed = Date.now() - startTime;
          await new Promise((res) =>
            setTimeout(res, Math.max(0, MIN_LOADING_TIME - elapsed))
          );
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          const elapsed = Date.now() - startTime;
          await new Promise((res) =>
            setTimeout(res, Math.max(0, MIN_LOADING_TIME - elapsed))
          );
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        await apiService.register({
          username: formData.username,
          email: formData.identifier,
          password: formData.password,
        });

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
      }
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
        <div className="group">
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
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
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
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
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
            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-14 py-3 sm:py-4 bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
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
        <div className="group">
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
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-14 py-3 sm:py-4 bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
              placeholder="Confirm your password"
              required={!isLogin}
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
        <div className="bg-red-50 text-red-600 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-600 text-white py-3 sm:py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] text-base sm:text-lg tracking-wide ${
          loading
            ? "opacity-80 cursor-not-allowed hover:translate-y-0 hover:scale-100"
            : ""
        }`}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 sm:w-6 sm:h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </>
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
    </form>
  );
}

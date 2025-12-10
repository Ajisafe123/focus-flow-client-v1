import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, KeyRound } from "lucide-react";
import apiService, { API_BASE_URL } from "../Service/apiService";

export default function AuthForm({ isLogin = true }) {
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
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        await apiService.login({
          identifier: formData.identifier.trim(),
          password: formData.password,
        });
        setSuccess("Login successful. Redirecting...");
        navigate("/");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      await apiService.register({
        username: formData.username.trim(),
        email: formData.identifier.trim(),
        password: formData.password,
      });

      setSuccess("Registration successful. Check your email for the code.");
      navigate("/verify-email");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = (provider) => {
    window.location.href = `${API_BASE_URL}/auth/login/${provider}`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white border border-emerald-100 shadow-xl rounded-2xl p-6 sm:p-8">
        <div className="mb-6 text-center space-y-2">
          <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-600 font-semibold">
            {isLogin ? "Login" : "Sign up"}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            {isLogin
              ? "Enter your credentials to continue."
              : "Use a valid email to receive verification."}
          </p>
        </div>

        <div className="space-y-3.5">
              {!isLogin && (
                <div className="group">
                  <label className="block text-slate-700 font-semibold text-xs uppercase tracking-wider mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 w-4 h-4 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors group-focus-within:shadow-sm"
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="group">
                <label className="block text-slate-700 font-semibold text-xs uppercase tracking-wider mb-1.5">
                  {isLogin ? "Email or Username" : "Email"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 w-4 h-4 group-focus-within:text-emerald-600 transition-colors" />
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors group-focus-within:shadow-sm"
                    placeholder={
                      isLogin ? "your@email.com or username" : "your@email.com"
                    }
                    required
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-700 font-semibold text-xs uppercase tracking-wider">
                    Password
                  </label>
                  {isLogin && (
                    <Link
                      to="/forgot-password"
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <KeyRound className="w-3 h-3" />
                      Forgot?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 w-4 h-4 group-focus-within:text-emerald-600 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 rounded border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors group-focus-within:shadow-sm"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="group">
                  <label className="block text-slate-700 font-semibold text-xs uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 w-4 h-4 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 rounded border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors group-focus-within:shadow-sm"
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border-l-2 border-red-500 text-red-700 px-3 py-2.5 rounded text-xs font-medium">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">⚠</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}
              {success && (
                <div className="bg-emerald-50 border-l-2 border-emerald-500 text-emerald-800 px-3 py-2.5 rounded text-xs font-medium">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span>{success}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-linear-to-r from-emerald-600 to-teal-600 text-white py-2.5 rounded font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                      <div
                        className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                    <span>Processing...</span>
                  </span>
                ) : isLogin ? (
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Sign In
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <User className="w-4 h-4" />
                    Create Account
                  </span>
                )}
              </button>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => handleSocial("google")}
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 rounded-md py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-4 h-4"
                  />
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocial("facebook")}
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 rounded-md py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  <img
                    src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                    alt="Facebook"
                    className="w-4 h-4"
                  />
                  Continue with Facebook
                </button>
              </div>

              <p className="text-center text-slate-600 text-xs mt-4">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Link
                  to={isLogin ? "/register" : "/login"}
                  className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                >
                  {isLogin ? "Create one" : "Login"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

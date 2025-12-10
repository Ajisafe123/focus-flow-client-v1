import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import apiService from "../Service/apiService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const MIN_LOADING_TIME = 2000;

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid email";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);
    const startTime = Date.now();

    try {
      await apiService.forgotPassword(email);
      const elapsed = Date.now() - startTime;
      await new Promise((resolve) =>
        setTimeout(resolve, Math.max(0, MIN_LOADING_TIME - elapsed))
      );

      setSuccess(true);
      setTimeout(() => navigate(`/reset-password?email=${email}`), 2000);
    } catch (error) {
      setErrors({ api: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 bg-emerald-50"
    >
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white border border-emerald-100 rounded-2xl shadow-xl p-6 sm:p-7">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
              <div className="flex items-center gap-3 text-emerald-700 font-semibold">
                <Mail className="w-5 h-5 animate-pulse" />
                Sending reset code...
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-3 shadow-md">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Forgot password</h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your email and we&apos;ll email you a reset code.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-emerald-800 font-semibold mb-2 text-xs uppercase tracking-wide">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-600 transition-colors duration-200">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({});
                  }}
                  className={`w-full pl-10 pr-3 py-3 text-gray-800 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm ${
                    errors.email
                      ? "border-red-500 focus:ring-red-200"
                      : "border-emerald-200 focus:ring-emerald-200 focus:border-emerald-400"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {errors.api && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-xl text-sm font-medium shadow-sm">
                {errors.api}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-xl text-sm font-medium shadow-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Reset code sent! Redirecting...
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-3 text-white font-semibold bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-600 rounded-xl transition-all duration-200 text-base shadow-md hover:shadow-lg flex justify-center items-center gap-2 ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              <Mail className="w-5 h-5" />
              Send reset code
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold underline"
            >
              Remember your password? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

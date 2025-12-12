import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import apiService from "../Service/apiService";
import { CheckCircle, ArrowRight, RotateCcw } from "lucide-react";
import AuthLayout from "./AuthLayout";
import LoadingSpinner from "../Common/LoadingSpinner";
import { motion } from "framer-motion";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { search } = useLocation();
  const navigate = useNavigate();
  const email = new URLSearchParams(search).get("email") || "";
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (resending || !email) return;
    setResending(true);
    setError("");
    try {
      await apiService.resendVerificationCode(email);
      // Show success feedback - maybe a temporary success msg
      alert("Verification code resent! Please check your email.");
    } catch (err) {
      setError(err.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return setError("Code required");
    setLoading(true);
    setError("");
    try {
      const res = await apiService.verifyEmail({ email, code });
      setSuccess(true);

      // Dispatch event to update app state if token was received
      if (res.token) {
        window.dispatchEvent(new Event("loginStatusChanged"));
      }

      setTimeout(() => {
        const role = localStorage.getItem("role");
        if (role === "admin") {
          navigate("/admin");
        } else if (res.token) {
          navigate("/");
        } else {
          navigate("/login");
        }
      }, 2000);
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify Email"
      subtitle={`Enter the 6-character code sent to ${email}`}
      image="https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?q=80&w=2000&auto=format&fit=crop"
      maxWidth="max-w-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-emerald-50 text-emerald-600 text-xs rounded-lg border border-emerald-100 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Email verified successfully! Redirecting...
          </motion.div>
        )}

        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Verification Code
          </label>
          <div className="group">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder="XXXXXX"
              maxLength={6}
              className="w-full px-4 py-4 text-center text-3xl tracking-[0.5em] font-mono bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300 text-slate-900 uppercase"
            />
          </div>
          <p className="text-center text-xs text-slate-400">
            Check your spam folder if you don't see the email.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors disabled:opacity-50"
          >
            <RotateCcw className={`w-3 h-3 ${resending ? "animate-spin" : ""}`} />
            {resending ? "Resending..." : "Resend Code"}
          </button>
        </div>

        <div className="relative pt-4">
          <div className="absolute inset-0 flex items-center pt-4">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest pt-4">
            <span className="bg-white px-2 text-slate-400">
              Or
            </span>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs">
          Back to{" "}
          <Link to="/login" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../Service/apiService";
import { Mail, CheckCircle, KeyRound } from "lucide-react";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { search } = useLocation();
  const navigate = useNavigate();
  const email = new URLSearchParams(search).get("email") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return setError("Code required");
    setLoading(true);
    setError("");
    try {
      await apiService.verifyEmail({ email, code });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="w-full max-w-xs bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-3">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-semibold">Verify Email</h2>
          <p className="text-gray-600 text-sm mt-1 break-words">
            Code sent to {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <KeyRound
              className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500"
              size={18}
            />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="A1B2C3"
              maxLength={6}
              className="w-full pl-10 pr-3 py-3 text-center text-xl tracking-widest border border-emerald-300 rounded-lg focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-red-600 text-center text-sm">{error}</p>}
          {success && (
            <p className="text-green-600 text-center text-sm flex items-center justify-center gap-2">
              <CheckCircle size={16} /> Verified! Redirecting...
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
}

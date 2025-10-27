import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";

function ResetPassword() {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [noToken, setNoToken] = useState(false);
  const [touchDots, setTouchDots] = useState([]);
  const [floatingElements, setFloatingElements] = useState([]);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) setNoToken(true);

    const elements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 8 + 4,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 10,
    }));
    setFloatingElements(elements);
  }, [email]);

  const handleTouch = (e) => {
    if (window.innerWidth <= 768) {
      const touch = e.touches[0];
      const newDot = {
        id: Date.now() + Math.random(),
        x: touch.clientX,
        y: touch.clientY,
      };
      setTouchDots((prev) => [...prev, newDot]);
      setTimeout(
        () =>
          setTouchDots((prev) => prev.filter((dot) => dot.id !== newDot.id)),
        1000
      );
    }
  };

  const validate = () => {
    const errs = {};
    if (!code.trim()) errs.code = "Verification code is required";
    if (!newPassword) errs.newPassword = "New password is required";
    else if (newPassword.length < 6)
      errs.newPassword = "Password must be at least 6 characters";
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
    if (newPassword && confirmPassword && newPassword !== confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrors({
        api: "Please click the link in your email to reset your password.",
      });
      return;
    }

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        "https://focus-flow-server-v1.onrender.com/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code, new_password: newPassword }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Password reset failed");
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrors({ api: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-2 relative"
      onTouchStart={handleTouch}
    >
      {touchDots.map((dot) => (
        <div
          key={dot.id}
          className="fixed w-8 h-8 pointer-events-none z-50 animate-ping"
          style={{ left: dot.x - 16, top: dot.y - 16 }}
        >
          <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-75"></div>
        </div>
      ))}

      {floatingElements.map((el) => (
        <div
          key={el.id}
          className="absolute opacity-20 pointer-events-none"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            width: `${el.size}px`,
            height: `${el.size}px`,
            animation: `float ${el.duration}s ease-in-out infinite`,
            animationDelay: `${el.delay}s`,
          }}
        >
          <div className="w-full h-full bg-emerald-500 rounded-full blur-sm"></div>
        </div>
      ))}

      <div className="flex flex-col w-full max-w-sm bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden relative z-10 p-6 border border-gray-100">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-3 shadow-lg">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Reset Password
          </h2>
          <p className="text-gray-500 text-sm">
            {noToken
              ? "Please click the link in your email to reset your password."
              : "Enter your verification code and new password"}
          </p>
        </div>

        {!noToken && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative group">
              <KeyRound
                className="absolute left-3 top-3.5 text-emerald-400 group-focus-within:text-emerald-600 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Verification Code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (errors.code) setErrors({});
                }}
                className={`w-full pl-10 pr-3 py-3.5 text-gray-800 bg-white border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm hover:shadow-md text-sm tracking-widest ${
                  errors.code
                    ? "border-red-500 focus:ring-red-200"
                    : "border-emerald-200 focus:ring-emerald-200 focus:border-emerald-400"
                }`}
              />
              {errors.code && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.code}
                </p>
              )}
            </div>

            <div className="relative group">
              <Lock
                className="absolute left-3 top-3.5 text-emerald-400 group-focus-within:text-emerald-600 transition-colors"
                size={18}
              />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword) setErrors({});
                }}
                className={`w-full pl-10 pr-10 py-3.5 text-gray-800 bg-white border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm hover:shadow-md text-sm ${
                  errors.newPassword
                    ? "border-red-500 focus:ring-red-200"
                    : "border-emerald-200 focus:ring-emerald-200 focus:border-emerald-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-emerald-600 transition-colors"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div className="relative group">
              <Lock
                className="absolute left-3 top-3.5 text-emerald-400 group-focus-within:text-emerald-600 transition-colors"
                size={18}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({});
                }}
                className={`w-full pl-10 pr-10 py-3.5 text-gray-800 bg-white border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm hover:shadow-md text-sm ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-200"
                    : "border-emerald-200 focus:ring-emerald-200 focus:border-emerald-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-emerald-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {errors.api && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 py-2.5 rounded-lg text-xs font-medium shadow-sm animate-shake">
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
                  {errors.api}
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-3 py-2.5 rounded-lg text-xs font-medium shadow-sm animate-slideIn">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Password successfully reset! Redirecting...
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`relative w-full px-4 py-3.5 text-white font-bold bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-600 rounded-xl transition-all duration-300 text-sm shadow-lg hover:shadow-xl flex justify-center items-center gap-2 transform hover:-translate-y-0.5 hover:scale-[1.02] overflow-hidden ${
                isLoading
                  ? "opacity-90 cursor-not-allowed hover:translate-y-0 hover:scale-100"
                  : ""
              }`}
            >
              {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-700 animate-shimmer"></div>
              )}
              <div className="relative flex items-center gap-2">
                {isLoading ? (
                  <>
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                    <span className="animate-pulse">Resetting...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Reset Password</span>
                  </>
                )}
              </div>
            </button>
          </form>
        )}

        {noToken && (
          <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-700 px-4 py-3 rounded-lg text-sm font-medium shadow-sm">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Please use the reset link sent to your email</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(90deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
          75% {
            transform: translateY(-10px) rotate(270deg);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }

        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

export default ResetPassword;

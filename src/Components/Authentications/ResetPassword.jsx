import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

function ResetPassword() {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verifiedMessage, setVerifiedMessage] = useState("");
  const [noToken, setNoToken] = useState(false);
  const [touchDots, setTouchDots] = useState([]);
  const [floatingElements, setFloatingElements] = useState([]);
  const [step, setStep] = useState(1);
  const [verified, setVerified] = useState(false);

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

  const validatePasswords = () => {
    const errs = {};
    if (!newPassword) errs.newPassword = "New password is required";
    else if (newPassword.length < 6)
      errs.newPassword = "Password must be at least 6 characters";
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
    if (newPassword && confirmPassword && newPassword !== confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setErrors({ code: "Verification code is required" });
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      const res = await fetch(
        "https://focus-flow-server-v1.onrender.com/auth/verify-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Invalid or expired code");
      }

      setVerified(true);
      setVerifiedMessage("Code verified successfully!");
      setTimeout(() => {
        setStep(2);
        setVerifiedMessage("");
      }, 1500);
    } catch (err) {
      setErrors({ api: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const validationErrors = validatePasswords();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);
    setErrors({});
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
              : step === 1
              ? "Enter your verification code to continue"
              : "Enter your new password below"}
          </p>
        </div>

        {!noToken && (
          <form
            onSubmit={step === 1 ? handleVerifyCode : handleResetPassword}
            className="space-y-4"
          >
            {step === 1 && (
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
                  <p className="text-red-500 text-xs mt-1.5 ml-1">
                    {errors.code}
                  </p>
                )}
              </div>
            )}

            {verifiedMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-3 py-2.5 rounded-lg text-xs font-medium shadow-sm animate-slideIn flex items-center gap-2">
                <CheckCircle size={14} /> {verifiedMessage}
              </div>
            )}

            {step === 2 && (
              <>
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
                    <p className="text-red-500 text-xs mt-1.5 ml-1">
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
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </>
            )}

            {errors.api && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 py-2.5 rounded-lg text-xs font-medium shadow-sm animate-shake">
                {errors.api}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-3 py-2.5 rounded-lg text-xs font-medium shadow-sm animate-slideIn flex items-center gap-2">
                <CheckCircle size={14} /> Password successfully reset!
                Redirecting...
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
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                  <span className="animate-pulse">
                    {step === 1 ? "Verifying..." : "Resetting..."}
                  </span>
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{step === 1 ? "Verify Code" : "Reset Password"}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(90deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          75% { transform: translateY(-10px) rotate(270deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}

export default ResetPassword;

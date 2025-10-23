import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import apiService from "../../Services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(""); // new field for verification code
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touchDots, setTouchDots] = useState([]);
  const [floatingElements, setFloatingElements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const elements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 8 + 4,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 10,
    }));
    setFloatingElements(elements);
  }, []);

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
    if (!email.trim()) errs.email = "Email is required";
    if (!code.trim()) errs.code = "Verification code is required"; // validate code
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);
    try {
      await apiService.forgotPassword(email, code); // send both email & code
      setSuccess(true);
      setTimeout(() => navigate("/reset-password"), 2000);
    } catch (error) {
      setErrors({ api: error.message || "Failed to send reset email" });
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
          <div className="w-full h-full bg-gradient-to-r from-[#FFD700] to-amber-400 rounded-full opacity-75"></div>
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
          <div className="w-full h-full bg-[#FFD700] rounded-full blur-sm"></div>
        </div>
      ))}

      <div className="flex flex-col w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden relative z-10 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          Forgot Password
        </h2>
        <p className="text-gray-500 font-light text-sm mb-4">
          Enter your email to receive a password reset code
        </p>

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 pr-3 py-3 text-gray-800 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-200 focus:ring-emerald-400"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`w-full pl-3 pr-3 py-3 text-gray-800 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.code
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-200 focus:ring-emerald-400"
              }`}
            />
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">{errors.code}</p>
            )}
          </div>
        </div>

        {errors.api && <p className="text-red-500 text-xs">{errors.api}</p>}
        {success && (
          <p className="text-green-500 text-xs mt-2">
            Code sent! Redirecting...
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full mt-4 px-4 py-3 text-white font-medium bg-emerald-800 rounded-lg hover:bg-emerald-700 transition-colors text-sm flex justify-center items-center gap-2"
        >
          {isLoading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {isLoading ? "Sending..." : "Send Reset Code"}
        </button>
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
}

export default ForgotPassword;

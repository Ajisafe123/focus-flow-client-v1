import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle} from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touchDots, setTouchDots] = useState([]);
  const [floatingElements, setFloatingElements] = useState([]);
  const navigate = useNavigate();
  const MIN_LOADING_TIME = 2000;

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
      const res = await fetch("https://focus-flow-server-v1.onrender.com/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const elapsed = Date.now() - startTime;
      await new Promise((resolve) =>
        setTimeout(resolve, Math.max(0, MIN_LOADING_TIME - elapsed))
      );

      if (!res.ok) throw new Error("Failed to send reset email");

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
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
      }}
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

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-3xl">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-emerald-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-emerald-600 animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
                <p className="text-emerald-700 font-semibold text-sm animate-pulse">
                  Sending reset code...
                </p>
              </div>
            </div>
          )}

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-4 shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Forgot Password?
              </h2>
              <p className="text-gray-600 text-sm">
                No worries! Enter your email and we'll send you a reset code
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-emerald-800 font-semibold mb-2 text-sm tracking-wide uppercase">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-600 transition-colors duration-200">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({});
                    }}
                    className={`w-full pl-12 pr-4 py-4 text-gray-800 bg-white border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 shadow-md hover:shadow-lg ${
                      errors.email
                        ? "border-red-500 focus:ring-red-200"
                        : "border-emerald-200 focus:ring-emerald-200 focus:border-emerald-400"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
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
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {errors.api && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-xl text-sm font-medium shadow-md animate-shake">
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
                    <span>{errors.api}</span>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-xl text-sm font-medium shadow-md animate-slideIn">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Reset code sent successfully! Redirecting...</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-4 py-4 text-white font-bold bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-600 rounded-2xl transition-all duration-300 text-base shadow-lg hover:shadow-xl flex justify-center items-center gap-2 transform hover:-translate-y-1 hover:scale-[1.02] ${
                  isLoading
                    ? "opacity-80 cursor-not-allowed hover:translate-y-0 hover:scale-100"
                    : ""
                }`}
              >
                <Mail className="w-5 h-5" />
                Send Reset Code
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-all duration-200"
              >
                Remember your password? Sign in
              </button>
            </div>
          </div>
        </div>
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

        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default ForgotPassword;

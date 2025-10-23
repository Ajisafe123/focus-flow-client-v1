import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import apiService from "../../Services/api";

function ResetPassword() {
  const [code, setCode] = useState(""); // verification code
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [noToken, setNoToken] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) setNoToken(true);
  }, [token]);

  const validate = () => {
    const errs = {};
    if (!newPassword) errs.newPassword = "New password is required";
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
    if (newPassword && confirmPassword && newPassword !== confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    if (!code.trim()) errs.code = "Verification code is required";
    return errs;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!token) {
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
      await apiService.resetPassword({ token, code, newPassword });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrors({ api: error.message || "Password reset failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 relative border-b-2 border-[#FFD700]">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFD700' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3Ccircle cx='0' cy='30' r='4'/%3E%3Ccircle cx='60' cy='30' r='4'/%3E%3Ccircle cx='30' cy='0' r='4'/%3E%3Ccircle cx='30' cy='60' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="flex flex-col w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden relative z-10 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          Reset Password
        </h2>
        <p className="text-gray-500 font-light text-sm mb-4">
          {noToken
            ? "Please click the link in your email to reset your password."
            : "Enter your verification code and new password"}
        </p>

        {!noToken && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full pl-3 pr-3 py-3 text-gray-800 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.code
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-200 focus:ring-[#FFD700]"
                }`}
              />
              {errors.code && (
                <p className="text-red-500 text-xs mt-1">{errors.code}</p>
              )}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-3 text-gray-800 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.newPassword
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-200 focus:ring-[#FFD700]"
                }`}
              />
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-3 text-gray-800 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-200 focus:ring-[#FFD700]"
                }`}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        )}

        {errors.api && (
          <p className="text-red-500 text-xs mt-2">{errors.api}</p>
        )}
        {success && (
          <p className="text-green-500 text-xs mt-2">
            Password successfully reset! Redirecting...
          </p>
        )}

        {!noToken && (
          <button
            onClick={handleResetPassword}
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
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;

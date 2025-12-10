import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import LoadingSpinner from "../Common/LoadingSpinner";
import { motion } from "framer-motion";
import apiService from "../Service/apiService";
import SocialLogin from "./SocialLogin";
import AuthLayout from "./AuthLayout";

export default function LoginPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await apiService.login({
                identifier: identifier.trim(),
                password: password,
            });

            // Dispatch event to update app state
            window.dispatchEvent(new Event("loginStatusChanged"));

            const role = localStorage.getItem("role");
            if (role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            if (err.status === 403) {
                // Check if backend provided email
                const emailToVerify = err.data?.email || (identifier.includes("@") ? identifier : "");
                if (emailToVerify) {
                    navigate(`/verify-email?email=${encodeURIComponent(emailToVerify)}`);
                    return;
                }
            }
            setError(err.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Sign In"
            subtitle="Access your account"
            maxWidth="max-w-sm"
            image="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=2128&auto=format&fit=crop"
        >
            <form className="space-y-5" onSubmit={handleSubmit}>
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

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Username or Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors w-4 h-4" />
                            <input
                                type="text"
                                required
                                value={identifier}
                                onChange={(e) => {
                                    setIdentifier(e.target.value);
                                    setError("");
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 text-sm text-slate-900 font-medium"
                                placeholder="Enter your identifier"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Password</label>
                            <Link
                                to="/forgot-password"
                                className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors w-4 h-4" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 text-sm text-slate-900 font-medium"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors p-1"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                    {loading ? (
                        <LoadingSpinner size="small" />
                    ) : (
                        <>
                            Bismillah (Start)
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>

                <div className="relative pt-2">
                    <div className="absolute inset-0 flex items-center pt-2">
                        <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest pt-2">
                        <span className="bg-white px-2 text-slate-400">
                            Or continue with
                        </span>
                    </div>
                </div>

                <SocialLogin />

                <p className="text-center text-slate-500 text-xs">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline">
                        Register Now
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}

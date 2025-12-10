import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
                >
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>

                    <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Page Not Found</h2>

                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;

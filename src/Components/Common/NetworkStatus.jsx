import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-red-100"
                >
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <WifiOff className="w-10 h-10 text-red-500" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Internet</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        It looks like you've lost your connection. Please check your internet settings and try again.
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all duration-300"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Retry Connection
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default NetworkStatus;

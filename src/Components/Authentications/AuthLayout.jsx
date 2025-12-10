import React from "react";
import { Link } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const AuthLayout = ({
    title,
    subtitle,
    image,
    children,
    reverse = false,
    backLink = "/",
    backText = "Back to Home",
    maxWidth = "max-w-[480px]"
}) => {
    return (
        <div className="min-h-screen bg-slate-50 lg:bg-white text-slate-800 grid lg:grid-cols-2 relative overflow-hidden">

            {/* Mobile Background Image (Visible only on small screens) */}
            <div className="absolute inset-0 lg:hidden z-0">
                <img
                    src={image || "https://images.unsplash.com/photo-1596492784531-6e6eb5ea92f5?q=80&w=2070&auto=format&fit=crop"}
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-emerald-900/60 backdrop-blur-sm" />
            </div>

            {/* Form Side */}
            <div className={`flex flex-col justify-center items-center px-4 sm:px-6 lg:px-20 relative z-10 pt-12 pb-24 ${reverse ? 'lg:order-last' : ''}`}>
                <div className={`w-full ${maxWidth} bg-white lg:bg-transparent p-6 sm:p-10 rounded-xl shadow-2xl lg:shadow-none space-y-8 border border-white/20 lg:border-none`}>

                    {/* Top Navigation */}
                    <div className="flex justify-between items-center">
                        <Link to={backLink} className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors text-sm font-medium group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            {backText}
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            {title}
                        </h1>
                        {subtitle && <p className="text-slate-500 text-lg">{subtitle}</p>}
                    </div>

                    {/* Form Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>

                </div>
            </div>

            {/* Image Side (Desktop Only) */}
            <div className={`hidden lg:block relative overflow-hidden bg-emerald-900 ${reverse ? 'lg:order-first' : ''}`}>
                <img
                    src={image || "https://images.unsplash.com/photo-1596492784531-6e6eb5ea92f5?q=80&w=2070&auto=format&fit=crop"}
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/40 to-transparent" />

                {/* Decorative Patterns */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" />

                {/* Quote/Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-xl mx-auto text-center"
                    >
                        <p className="text-2xl font-serif leading-relaxed italic opacity-90 mb-6">
                            "Whoever travels a path in search of knowledge, Allah will make easy for him a path to Paradise."
                        </p>
                        <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full mb-4" />
                        <p className="text-emerald-200 font-medium tracking-wide text-sm uppercase">
                            Prophet Muhammad (ﷺ)
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;

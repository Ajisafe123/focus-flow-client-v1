import React from "react";
import { User, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import mosqueImage from "../Assets/greenbg.jpg";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative pt-24 sm:pt-28 lg:pt-30 h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 w-full h-full scale-105"
        style={{
          backgroundImage: `url(${mosqueImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-emerald-950/70 to-teal-950/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.15)_0%,_transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(20,184,166,0.15)_0%,_transparent_50%)]"></div>

      <svg
        className="absolute bottom-0 left-0 w-full h-40 sm:h-48 lg:h-56 pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#f8fafc", stopOpacity: 0.03 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#ffffff", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <path
          d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,133.3C672,117,768,107,864,122.7C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill="url(#waveGradient)"
          opacity="0.3"
        />
        <path
          d="M0,160L48,170.7C96,181,192,203,288,213.3C384,224,480,224,576,208C672,192,768,160,864,154.7C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill="url(#waveGradient)"
          opacity="0.5"
        />
        <path
          d="M0,224L48,229.3C96,235,192,245,288,234.7C384,224,480,192,576,181.3C672,171,768,181,864,197.3C960,213,1056,235,1152,229.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill="#ffffff"
        />
      </svg>
      <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-6 sm:px-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-md rounded-full border border-emerald-400/40">
          <p className="text-emerald-200 text-xs sm:text-sm font-medium tracking-wide">
            السلام عليكم ورحمة الله وبركاته
          </p>
        </div>

        <h1 className=" header-text text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
          <span className="block text-white drop-shadow-xl">
            A Light of Guidance
          </span>
          <span className="block bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent mt-2 drop-shadow-xl">
            Nibras al-Deen
          </span>
        </h1>

        <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto mb-6 rounded-full"></div>

        <p className="text-slate-100 text-base sm:text-lg lg:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          Connecting hearts to faith, prayer, and knowledge. Explore a space
          built for reflection, learning, and spiritual growth for the ummah.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
          <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-full text-sm sm:text-base font-bold transition-all duration-300 w-full sm:w-auto shadow-2xl shadow-emerald-500/50 hover:scale-105 hover:shadow-emerald-400/70">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Join the Community</span>
          </button>

          <Link
            to="/prayer-times"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full text-sm sm:text-base font-bold transition-all duration-300 border-2 border-white/30 hover:border-white/50 w-full sm:w-auto backdrop-blur-md hover:scale-105"
          >
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Prayer Times</span>
          </Link>
        </div>
        <div className="mt-12 flex justify-center opacity-30">
          <div className="w-20 h-20 border-2 border-emerald-400 rotate-45 rounded-lg"></div>
        </div>
      </div>
    </section>
  );
}

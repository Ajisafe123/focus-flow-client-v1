import React from "react";
import { Moon, Headphones, BookOpen, Globe, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur">
                <Moon className="w-8 h-8" />
              </div>
              <div>
                <span className="text-2xl font-bold block">Nibras al-Deen</span>
                <span className="text-xs text-emerald-200">Online Hub</span>
              </div>
            </div>
            <p className="text-emerald-200 leading-relaxed mb-4">
              Empowering Muslims worldwide through faith, knowledge, and digital
              learning rooted in the Qur’an and Sunnah.
            </p>
            <p className="text-sm text-emerald-300 italic">
              "Whoever travels a path in search of knowledge, Allah will make
              easy for him a path to Paradise." — Prophet Muhammad ﷺ
            </p>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                "Home",
                "Prayer Times",
                "Learning Hub",
                "About Us",
                "Contact",
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-emerald-200 hover:text-white transition flex items-center space-x-2"
                  >
                    <span>→</span>
                    <span>{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Explore</h4>
            <ul className="space-y-3 text-emerald-200">
              {[
                "Audio Lectures",
                "Video Lessons",
                "E-Library",
                "Live Sessions",
                "Community Talks",
                "Weekly Programs",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Stay Connected</h4>
            <p className="text-emerald-200 mb-4">
              Join our online community for updates on lectures, events, and new
              programs.
            </p>
            <div className="flex space-x-4 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition cursor-pointer">
                <Globe className="w-6 h-6" />
              </div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition cursor-pointer">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition cursor-pointer">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition cursor-pointer">
                <Mail className="w-6 h-6" />
              </div>
            </div>
            <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium px-6 py-3 rounded-xl w-full hover:from-emerald-700 hover:to-teal-700 transition transform hover:scale-105">
              Join Our Community
            </button>
          </div>
        </div>

        <div className="border-t border-emerald-700 pt-8 text-center">
          <p className="text-emerald-200 mb-2">
            &copy; 2025 Nibras al-Deen Online Hub. All rights reserved.
          </p>
          <p className="text-emerald-300 text-sm">
            May Allah increase us in knowledge and guide us on the straight
            path. Ameen.
          </p>
        </div>
      </div>
    </footer>
  );
}

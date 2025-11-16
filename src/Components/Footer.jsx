import React from "react";
import {
  Moon,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
} from "lucide-react";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Prayer Times", path: "/prayer-times" },
  { name: "Learning Hub", path: "/learning-hub" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const exploreLinks = [
  "Audio Lectures",
  "Video Lessons",
  "E-Library",
  "Live Sessions",
  "Weekly Programs",
  "Scholarly Articles",
];

const socialMediaLinks = [
  {
    icon: Facebook,
    href: "https://facebook.com/nibras_deen",
    name: "Facebook",
  },
  { icon: Twitter, href: "https://twitter.com/nibras_deen", name: "Twitter" },
  {
    icon: Instagram,
    href: "https://instagram.com/nibras_deen",
    name: "Instagram",
  },
  { icon: Youtube, href: "https://youtube.com/nibras_deen", name: "Youtube" },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur">
                <Moon className="w-8 h-8 text-emerald-100" />
              </div>
              <div>
                <span className="text-2xl font-bold block">Nibras al-Deen</span>
                <span className="text-xs text-emerald-200">Online Hub</span>
              </div>
            </div>
            <p className="text-emerald-200 leading-relaxed mb-4 text-sm">
              Empowering Muslims worldwide through faith, knowledge, and digital
              learning rooted in the Qur’an and Sunnah.
            </p>
            <p className="text-xs text-emerald-300 italic">
              "Whoever travels a path in search of knowledge, Allah will make
              easy for him a path to Paradise." — Prophet Muhammad ﷺ
            </p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-6 border-b border-emerald-700 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.path}
                    className="text-emerald-200 hover:text-white transition flex items-center space-x-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-6 border-b border-emerald-700 pb-2">
              Explore Content
            </h4>
            <ul className="space-y-3 text-emerald-200">
              {exploreLinks.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center space-x-2 text-sm hover:text-white transition"
                >
                  <span>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-6 border-b border-emerald-700 pb-2">
              Stay Connected
            </h4>
            <p className="text-emerald-200 mb-6 text-sm">
              Follow our social channels to stay updated with the latest
              lectures and programs.
            </p>

            <div className="flex space-x-3 mb-6">
              {socialMediaLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Link to our ${social.name} page`}
                    className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center 
                               hover:bg-emerald-500 hover:text-white transition duration-300 transform hover:scale-110"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
            <div className="flex items-center space-x-3 text-emerald-200 hover:text-white transition">
              <Mail className="w-5 h-5 text-emerald-400" />
              <a href="mailto:contact@nibrasaldeen.org" className="text-sm">
                contact@nibrasaldeen.org
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-emerald-700 pt-8 text-center">
          <p className="text-emerald-200 mb-2 text-sm">
            &copy; 2025 Nibras al-Deen Online Hub. All rights reserved.
          </p>
          <p className="text-emerald-300 text-xs italic">
            May Allah increase us in knowledge and guide us on the straight
            path. Ameen.
          </p>
        </div>
      </div>
    </footer>
  );
}

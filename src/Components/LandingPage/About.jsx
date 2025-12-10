import React from "react";
import { Heart, Moon, BookOpen, Users } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto text-center mb-20">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-emerald-50 rounded-full">
          <Moon className="w-4 h-4 text-emerald-600" />
          <span className="text-emerald-700 font-semibold text-sm">
            In the Light of Guidance
          </span>
        </div>
        <h2 className="header-text text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          About <span className="text-emerald-600">Nibras al-Deen</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          Nibras al-Deen (The Lamp of Faith) is a growing Islamic initiative
          dedicated to reviving the spirit of knowledge, worship, and community.
          We strive to be a guiding light—helping Muslims connect deeper with
          Allah, strengthen their faith, and live with purpose and unity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <div className="rounded-3xl overflow-hidden shadow-xl">
          <video
            src="https://res.cloudinary.com/dlvnjrqh6/video/upload/v1760145000/Masjid_pw7qyg.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-8 text-left">
          <p className="text-lg text-gray-700 leading-relaxed">
            We believe that Islam is not just a religion—it is a way of life,
            filled with mercy, wisdom, and light. Through our programs,
            lectures, and online platforms, Nibras al-Deen aims to spread
            authentic Islamic knowledge rooted in the Qur’an and Sunnah.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed">
            Our goal is to nurture hearts, inspire action, and bring the ummah
            together under the banner of faith. We are committed to serving our
            community by creating spaces of learning, remembrance, and unity.
          </p>

          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              Qur’an Circles
            </span>
            <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
              Youth Mentorship
            </span>
            <span className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold">
              Dawah Projects
            </span>
            <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
              Charity Drives
            </span>
          </div>

          <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-emerald-600" />
              <span className="text-gray-700 font-medium">
                Serving the Ummah Worldwide
              </span>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-emerald-600" />
              <span className="text-gray-700 font-medium">
                Guided by Knowledge
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-24">
        <Heart className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
        <p className="text-gray-600 max-w-2xl mx-auto text-lg italic">
          “The best among you are those who learn the Qur’an and teach it.”
          <br />
          <span className="text-emerald-700 font-semibold">
            – Prophet Muhammad ﷺ
          </span>
        </p>
      </div>
    </section>
  );
}

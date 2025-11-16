import React from "react";
import donation from "../Assets/donation.png";
import quran from "../Assets/quran.png";
import hadith from "../Assets/hadith.png";
import dua from "../Assets/dua.png";
import shop from "../Assets/shop.png";

const AppShowcase = () => {
  const screenshots = [donation, quran, dua, hadith, shop];

  const content = [
    {
      title: "A Light of Guidance",
      subtitle: "Nibras al-Deen",
      description:
        "Connecting hearts to faith, prayer, and knowledge. Explore a space built for reflection, learning, and spiritual growth for the ummah.",
      color: "from-emerald-600 to-teal-700",
    },
    {
      title: "Read the Holy Quran",
      subtitle: "Al-Baqarah",
      description:
        "Experience the beauty of Quranic recitation with crystal-clear Arabic text, translations, and professional audio guidance.",
      color: "from-teal-600 to-emerald-700",
    },
    {
      title: "Daily Supplications",
      subtitle: "Morning Adhkar",
      description:
        "A beautiful collection of authentic morning and evening adhkar prescribed by our beloved Prophet ﷺ to enrich your daily spiritual practice.",
      color: "from-emerald-700 to-green-600",
    },
    {
      title: "Hadith of the Day",
      subtitle: "Daily Wisdom",
      description:
        "Discover authentic hadiths with complete chain of narration, enriching your knowledge and strengthening your connection to the Sunnah.",
      color: "from-green-600 to-teal-700",
    },
    {
      title: "Islamic Shop",
      subtitle: "Quality Islamic Products",
      description:
        "Browse our curated collection of premium Qurans, prayer mats, books, and Islamic essentials delivered to your doorstep.",
      color: "from-teal-700 to-emerald-600",
    },
  ];

  const iconMapping = {
    0: donation,
    1: quran,
    2: dua,
    3: hadith,
    4: shop,
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 overflow-hidden">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12">
            <div className="flex flex-col items-center lg:items-start gap-6 text-center lg:text-left max-w-2xl">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center shadow-2xl border border-white/30">
                  <span className="text-4xl sm:text-5xl"></span>
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
                    Nibras Al-deen
                  </h1>
                  <p className="text-emerald-100 text-lg sm:text-xl font-medium mt-1">
                    Mobile App
                  </p>
                </div>
              </div>

              <p className="text-xl sm:text-2xl text-white/90 leading-relaxed">
                Your spiritual companion for faith, knowledge, and daily
                practice.
                <span className="block mt-3 text-emerald-100 text-lg">
                  Join thousands of Muslims worldwide in their journey.
                </span>
              </p>

              <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-4 mt-4">
                <button className="group px-6 sm:px-8 py-3 sm:py-4 bg-white text-emerald-900 rounded-xl sm:rounded-2xl font-bold shadow-2xl hover:shadow-emerald-900/20 hover:scale-[1.02] transition-all duration-300 flex items-center gap-3 justify-center text-base">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span>Download for iOS</span>
                </button>
                <button className="group px-6 sm:px-8 py-3 sm:py-4 bg-emerald-900/90 backdrop-blur text-white rounded-xl sm:rounded-2xl font-bold shadow-2xl hover:bg-emerald-950 hover:scale-[1.02] transition-all duration-300 flex items-center gap-3 justify-center border-2 border-white/20 text-base">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <span>Download for Android</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-8 mt-8 lg:mt-0 max-w-md">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/20 shadow-xl min-w-[120px]">
                <div className="text-3xl font-black text-white">50K+</div>
                <div className="text-emerald-100 text-sm mt-1">Downloads</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/20 shadow-xl min-w-[120px]">
                <div className="text-3xl font-black text-white">4.8★</div>
                <div className="text-emerald-100 text-sm mt-1">Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/20 shadow-xl min-w-[120px]">
                <div className="text-3xl font-black text-white">20+</div>
                <div className="text-emerald-100 text-sm mt-1">Countries</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              fill="white"
            />
          </svg>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32 pt-16 pb-16">
        {content.map((item, index) => {
          const isReversedOnLg = index % 2 !== 0;

          const rotationStyle = isReversedOnLg
            ? {
                transform:
                  "perspective(1200px) rotateY(-15deg) rotateX(2deg) scale(0.95)",
              }
            : {
                transform:
                  "perspective(1200px) rotateY(15deg) rotateX(2deg) scale(0.95)",
              };

          const rightButtons = isReversedOnLg ? "hidden" : "block";
          const leftButtons = isReversedOnLg ? "block" : "hidden";

          return (
            <div
              key={index}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
            >
              <div
                className={`${
                  isReversedOnLg ? "lg:order-2" : "lg:order-1"
                } space-y-4 sm:space-y-6 text-center lg:text-left`}
              >
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-md flex items-center justify-center p-2">
                    <img
                      src={iconMapping[index]}
                      alt={`${item.title} icon`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span
                    className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${item.color} text-white text-xs font-medium shadow-lg`}
                  >
                    FEATURE {index + 1}
                  </span>
                </div>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                  {item.title}
                </h2>

                <h3
                  className={`text-xl sm:text-2xl font-semibold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                >
                  {item.subtitle}
                </h3>

                <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {item.description}
                </p>

                <div className="flex gap-4 pt-4 justify-center lg:justify-start">
                  <button
                    className={`px-6 py-3 bg-gradient-to-r ${item.color} text-white rounded-full font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.05] transition-all duration-300 text-base`}
                  >
                    Get Started
                  </button>
                  <button className="px-6 py-3 bg-white text-gray-800 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-[1.05] transition-all duration-300 border border-gray-200 text-base">
                    Read More
                  </button>
                </div>
              </div>

              <div
                className={`${
                  isReversedOnLg ? "lg:order-1" : "lg:order-2"
                } flex justify-center p-4`}
              >
                <div
                  className="relative w-64 h-[550px] sm:w-80 sm:h-[650px] transition-all duration-700 hover:scale-[1.05] max-w-full"
                  style={{
                    transformStyle: "preserve-3d",
                    ...rotationStyle,
                  }}
                >
                  <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[3rem] sm:rounded-[3.5rem] p-2 sm:p-3 shadow-2xl">
                    <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-7 sm:h-9 bg-black rounded-full z-10 shadow-inner flex items-center justify-center gap-2 sm:gap-3">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-700 rounded-full"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full animate-pulse"></div>
                    </div>

                    <div className="w-full h-full bg-white rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden relative shadow-inner">
                      <img
                        src={screenshots[index]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white p-6 sm:p-8">
                              <div class="text-center">
                                <div class="text-5xl sm:text-6xl mb-4">📱</div>
                                <h3 class="text-lg sm:text-xl font-bold">${item.title}</h3>
                              </div>
                            </div>
                          `;
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 pointer-events-none"></div>
                      <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/30 rounded-full blur-3xl pointer-events-none"></div>
                    </div>

                    <div
                      className={`absolute -right-0.5 sm:-right-1 top-24 sm:top-32 w-1 h-16 sm:h-20 bg-gradient-to-b from-gray-700 to-gray-900 rounded-l-full ${rightButtons}`}
                    ></div>
                    <div
                      className={`absolute -left-0.5 sm:-left-1 top-20 sm:top-28 w-1 h-8 sm:h-10 bg-gradient-to-b from-gray-700 to-gray-900 rounded-r-full ${leftButtons}`}
                    ></div>
                    <div
                      className={`absolute -left-0.5 sm:-left-1 top-36 sm:top-44 w-1 h-12 sm:h-16 bg-gradient-to-b from-gray-700 to-gray-900 rounded-r-full ${leftButtons}`}
                    ></div>
                    <div
                      className={`absolute -left-0.5 sm:-left-1 top-56 sm:top-64 w-1 h-12 sm:h-16 bg-gradient-to-b from-gray-700 to-gray-900 rounded-r-full ${leftButtons}`}
                    ></div>

                    <div className="absolute inset-2 sm:inset-3 rounded-[2.5rem] sm:rounded-[3rem] border border-white/10 pointer-events-none"></div>
                  </div>

                  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-600/30 to-black/40 blur-3xl rounded-full scale-90 translate-y-12"></div>
                  <div
                    className={`absolute inset-0 -z-20 bg-gradient-to-r ${item.color} opacity-30 blur-2xl rounded-full scale-75`}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <div className="mt-16 sm:mt-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative overflow-hidden py-12 sm:py-16 rounded-2xl sm:rounded-3xl text-center text-white space-y-6 sm:space-y-8 px-6 sm:px-8 bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-300 rounded-full blur-3xl"></div>
          </div>

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Ready to Begin?
            </h2>
            <p className="text-base sm:text-xl text-emerald-100 max-w-3xl mx-auto mt-3 sm:mt-4">
              Join thousands of Muslims worldwide in their spiritual journey
              with Nibras Al-deen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-6 sm:pt-8">
              <button className="px-8 sm:px-10 py-3 sm:py-4 bg-white text-emerald-900 rounded-full font-bold text-base sm:text-lg hover:bg-emerald-50 transition-all hover:scale-[1.02] shadow-xl">
                Download for iOS
              </button>
              <button className="px-8 sm:px-10 py-3 sm:py-4 bg-emerald-900 text-white rounded-full font-bold text-base sm:text-lg hover:bg-emerald-950 transition-all hover:scale-[1.02] shadow-xl border-2 border-white/30">
                Download for Android
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShowcase;

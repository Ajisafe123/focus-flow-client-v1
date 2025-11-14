import React, { useState } from "react";
import {
  Heart,
  Users,
  BookOpen,
  Home,
  Utensils,
  Droplets,
  GraduationCap,
  Globe,
  Shield,
  Star,
  Award,
  Target,
  ChevronDown,
  ChevronUp,
  Check,
  TrendingUp,
} from "lucide-react";
import DonationForm from "./DonationForm";

const DONATION_CAUSES = [
  {
    id: 1,
    title: "Masjid Construction",
    description: "Help build and maintain houses of worship for the community",
    icon: Home,
    color: "emerald",
    raised: 45000,
    goal: 100000,
    supporters: 234,
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800",
  },
  {
    id: 2,
    title: "Feed the Needy",
    description: "Provide nutritious meals to families struggling with hunger",
    icon: Utensils,
    color: "emerald",
    raised: 32000,
    goal: 50000,
    supporters: 456,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
  },
  {
    id: 3,
    title: "Islamic Education",
    description: "Support Quran schools and Islamic education programs",
    icon: GraduationCap,
    color: "emerald",
    raised: 28000,
    goal: 75000,
    supporters: 189,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
  },
  {
    id: 4,
    title: "Clean Water Projects",
    description: "Build wells and provide clean water to communities in need",
    icon: Droplets,
    color: "emerald",
    raised: 15000,
    goal: 40000,
    supporters: 167,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
  },
  {
    id: 5,
    title: "Orphan Support",
    description: "Provide care, education, and support for orphaned children",
    icon: Heart,
    color: "emerald",
    raised: 52000,
    goal: 80000,
    supporters: 512,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
  },
  {
    id: 6,
    title: "Islamic Library",
    description: "Build and stock libraries with Islamic books and resources",
    icon: BookOpen,
    color: "emerald",
    raised: 18000,
    goal: 35000,
    supporters: 143,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
  },
];

const IMPACT_STATS = [
  { icon: Users, value: "10,000+", label: "Lives Impacted" },
  { icon: Globe, value: "25+", label: "Countries Served" },
  { icon: Heart, value: "$2.5M+", label: "Donated This Year" },
  { icon: Award, value: "15+", label: "Years of Service" },
];

const WHY_DONATE_POINTS = [
  {
    icon: Shield,
    title: "100% Secure & Private",
    description:
      "Your information is protected with bank-level encryption. We never share your data.",
  },
  {
    icon: Target,
    title: "Direct Impact",
    description:
      "100% of your donation goes directly to the chosen cause, minimizing administrative overhead.",
  },
  {
    icon: Check,
    title: "Vetted & Certified",
    description:
      "We are a fully certified non-profit organization, ensuring transparency and accountability.",
  },
  {
    icon: TrendingUp,
    title: "Sustainable Change",
    description:
      "We focus on long-term, sustainable projects that uplift entire communities.",
  },
];

const CauseCard = ({ cause, onDonate }) => {
  const percentage = (cause.raised / cause.goal) * 100;
  const Icon = cause.icon;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col">
      <div className="relative h-40 overflow-hidden">
        <img
          src={cause.image}
          alt={cause.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-full shadow-md">
              <Icon className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white drop-shadow-md">
              {cause.title}
            </h3>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <p className="text-gray-600 text-xs mb-3 line-clamp-2 flex-grow">
          {cause.description}
        </p>

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1 font-medium">
            <span className="text-emerald-700">
              ${cause.raised.toLocaleString()} raised
            </span>
            <span className="text-gray-500">
              Goal: ${cause.goal.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
            <Users className="w-3 h-3" />
            <span className="font-medium">{cause.supporters} supporters</span>
          </div>
        </div>

        <button
          onClick={() => onDonate(cause)}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2 rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[.98] focus:ring-2 focus:ring-emerald-200"
        >
          Donate Now
        </button>
      </div>
    </div>
  );
};

const WhyDonateDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 text-white text-center shadow-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-3 py-1 text-lg font-bold transition-all active:scale-[.99] focus:outline-none"
      >
        Why Donate With Us?
        {isOpen ? (
          <ChevronUp className="w-5 h-5 transition-transform" />
        ) : (
          <ChevronDown className="w-5 h-5 transition-transform" />
        )}
      </button>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 pt-4"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid grid-cols-2 gap-4">
            {WHY_DONATE_POINTS.map((point, index) => {
              const Icon = point.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-left border border-white/20"
                >
                  <Icon className="w-6 h-6 mb-1 text-emerald-200" />
                  <h4 className="font-bold mb-0.5 text-sm">{point.title}</h4>
                  <p className="text-xs text-emerald-100">
                    {point.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const DonatePage = () => {
  const [selectedCause, setSelectedCause] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-10 border-b-2 border-emerald-700 shadow-md">
        <div className="max-w-6xl mx-auto text-center px-3">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-white shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Make a Difference Today
          </h1>
          <p className="text-sm text-emerald-50 font-light mx-auto max-w-2xl leading-relaxed">
            Your generosity transforms lives and brings hope to those in need
          </p>
          <p
            className="text-emerald-100 text-xs mt-1"
            style={{ fontFamily: "Amiri, serif" }}
          >
            "The believer's shade on the Day of Resurrection will be their
            charity" - Prophet Muhammad ﷺ
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-3">
        {selectedCause ? (
          <DonationForm
            cause={selectedCause}
            onBackToCauses={() => setSelectedCause(null)}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {IMPACT_STATS.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="p-2 text-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 bg-emerald-100/50">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-extrabold text-gray-900 mb-0.5">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                Choose a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  Cause to Support
                </span>
              </h2>
              <p className="text-gray-600 text-sm max-w-xl mx-auto">
                Every contribution, no matter the size, creates ripples of
                positive change.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {DONATION_CAUSES.map((cause) => (
                <CauseCard
                  key={cause.id}
                  cause={cause}
                  onDonate={setSelectedCause}
                />
              ))}
            </div>

            <WhyDonateDropdown />
          </>
        )}
      </div>

      <footer className="bg-emerald-600 text-white py-6 mt-10 shadow-lg">
        <div className="max-w-6xl mx-auto px-3 text-center">
          <p className="text-xs font-light mb-1 text-emerald-100">
            "Charity does not decrease wealth" - Prophet Muhammad ﷺ
          </p>
          <p className="text-sm text-white font-semibold">
            جَزَاكَ ٱللَّٰهُ خَيْرًا - May Allah reward you with goodness
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DonatePage;

import React, { useState } from "react";
import {
  Heart,
  DollarSign,
  Users,
  BookOpen,
  Home,
  Utensils,
  Droplets,
  GraduationCap,
  Check,
  CreditCard,
  Building,
  Smartphone,
  Globe,
  Shield,
  Star,
  TrendingUp,
  Award,
  Target,
  X,
} from "lucide-react";

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

const PRESET_AMOUNTS = [25, 50, 100, 250, 500, 1000];

const IMPACT_STATS = [
  { icon: Users, value: "10,000+", label: "Lives Impacted" },
  { icon: Globe, value: "25+", label: "Countries Served" },
  { icon: Heart, value: "$2.5M+", label: "Donated This Year" },
  { icon: Award, value: "15+", label: "Years of Service" },
];

const PAYMENT_METHODS = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard },
  { id: "bank", name: "Bank Transfer", icon: Building },
  { id: "mobile", name: "Mobile Payment", icon: Smartphone },
];

const CauseCard = ({ cause, onDonate }) => {
  const percentage = (cause.raised / cause.goal) * 100;
  const Icon = cause.icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative h-56 overflow-hidden">
        <img
          src={cause.image}
          alt={cause.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-emerald-500 p-2 rounded-full">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">{cause.title}</h3>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {cause.description}
        </p>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-emerald-700">
              ${cause.raised.toLocaleString()} raised
            </span>
            <span className="text-gray-500">
              Goal: ${cause.goal.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{cause.supporters} supporters</span>
          </div>
        </div>

        <button
          onClick={() => onDonate(cause)}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Donate Now
        </button>
      </div>
    </div>
  );
};

const DonationModal = ({ cause, onClose }) => {
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [step, setStep] = useState(1);
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    phone: "",
    anonymous: false,
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  const Icon = cause.icon;

  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmount = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(value);
    if (value) setAmount(parseInt(value));
  };

  const handleSubmit = () => {
    alert(`Thank you for your donation of $${amount} to ${cause.title}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-3xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{cause.title}</h2>
                <p className="text-emerald-100 text-sm">{cause.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-6 flex gap-2">
            <div
              className={`flex-1 h-2 rounded-full ${
                step >= 1 ? "bg-white" : "bg-white/30"
              }`}
            ></div>
            <div
              className={`flex-1 h-2 rounded-full ${
                step >= 2 ? "bg-white" : "bg-white/30"
              }`}
            ></div>
            <div
              className={`flex-1 h-2 rounded-full ${
                step >= 3 ? "bg-white" : "bg-white/30"
              }`}
            ></div>
          </div>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Select Donation Amount
                </h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleAmountSelect(preset)}
                      className={`py-4 px-6 rounded-xl font-semibold transition-all ${
                        amount === preset && !customAmount
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={handleCustomAmount}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900">
                      Make this a recurring donation
                    </span>
                    <p className="text-sm text-gray-600">
                      Support this cause regularly
                    </p>
                  </div>
                </label>
                {isRecurring && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {["monthly", "quarterly", "yearly"].map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setFrequency(freq)}
                        className={`py-2 px-4 rounded-lg font-medium capitalize transition-all ${
                          frequency === freq
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border-l-4 border-emerald-500">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-emerald-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      Your Impact
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Your donation of ${amount} will help us reach our goal and
                      make a real difference in the lives of those in need.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg"
              >
                Continue to Details
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Your Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={donorInfo.name}
                    onChange={(e) =>
                      setDonorInfo({ ...donorInfo, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={donorInfo.email}
                    onChange={(e) =>
                      setDonorInfo({ ...donorInfo, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={donorInfo.phone}
                    onChange={(e) =>
                      setDonorInfo({ ...donorInfo, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={donorInfo.anonymous}
                    onChange={(e) =>
                      setDonorInfo({
                        ...donorInfo,
                        anonymous: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">
                    Make my donation anonymous
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Payment Method
              </h3>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {PAYMENT_METHODS.map((method) => {
                  const MethodIcon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === method.id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <MethodIcon
                        className={`w-6 h-6 mx-auto mb-2 ${
                          paymentMethod === method.id
                            ? "text-emerald-600"
                            : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`text-xs font-medium ${
                          paymentMethod === method.id
                            ? "text-emerald-700"
                            : "text-gray-600"
                        }`}
                      >
                        {method.name}
                      </p>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          cardNumber: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.expiry}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            expiry: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cvv}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            cvv: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.nameOnCard}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          nameOnCard: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-emerald-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Secure Payment
                    </h4>
                    <p className="text-sm text-gray-700">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
                <div className="border-t-2 border-emerald-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Donation Amount:</span>
                    <span className="font-semibold">${amount}</span>
                  </div>
                  {isRecurring && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Frequency:</span>
                      <span className="font-semibold capitalize">
                        {frequency}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t-2 border-emerald-200 pt-2">
                    <span>Total:</span>
                    <span className="text-emerald-600">${amount}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Complete Donation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DonatePage = () => {
  const [selectedCause, setSelectedCause] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-16 border-b-4 border-emerald-700 shadow-2xl">
        <div className="max-w-7xl mx-auto text-center px-4">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white shadow-xl">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            Make a Difference Today
          </h1>
          <p className="text-xl text-emerald-50 font-light mx-auto max-w-3xl leading-relaxed mb-2">
            Your generosity transforms lives and brings hope to those in need
          </p>
          <p
            className="text-emerald-100 text-sm"
            style={{ fontFamily: "Amiri, serif" }}
          >
            "The believer's shade on the Day of Resurrection will be their
            charity" - Prophet Muhammad ﷺ
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {IMPACT_STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 text-center border-2 border-emerald-100 hover:border-emerald-300 transition-all"
              >
                <div className="bg-gradient-to-r from-emerald-100 to-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Choose a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Cause to Support
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Every contribution, no matter the size, creates ripples of positive
            change in our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {DONATION_CAUSES.map((cause) => (
            <CauseCard
              key={cause.id}
              cause={cause}
              onDonate={setSelectedCause}
            />
          ))}
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white text-center shadow-2xl">
          <Star className="w-16 h-16 mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4">Why Donate With Us?</h3>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Shield className="w-10 h-10 mx-auto mb-3" />
              <h4 className="font-bold mb-2">100% Secure</h4>
              <p className="text-sm text-emerald-100">
                Your donations are protected with bank-level encryption
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Target className="w-10 h-10 mx-auto mb-3" />
              <h4 className="font-bold mb-2">Direct Impact</h4>
              <p className="text-sm text-emerald-100">
                100% of your donation goes directly to the cause
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Check className="w-10 h-10 mx-auto mb-3" />
              <h4 className="font-bold mb-2">Tax Deductible</h4>
              <p className="text-sm text-emerald-100">
                Receive tax receipts for all your contributions
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedCause && (
        <DonationModal
          cause={selectedCause}
          onClose={() => setSelectedCause(null)}
        />
      )}

      <footer className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-8 mt-16 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-base font-light mb-2">
            "Charity does not decrease wealth" - Prophet Muhammad ﷺ
          </p>
          <p className="text-sm text-emerald-100">
            جَزَاكَ ٱللَّٰهُ خَيْرًا - May Allah reward you with goodness
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DonatePage;

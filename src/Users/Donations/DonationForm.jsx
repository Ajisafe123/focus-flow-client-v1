import React, { useState, useMemo } from "react";
import {
  Heart,
  DollarSign,
  Users,
  CreditCard,
  Building,
  Smartphone,
  Check,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

const PRESET_AMOUNTS = [25, 50, 100, 250, 500, 1000];

const PAYMENT_METHODS = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard },
  { id: "bank", name: "Bank Transfer", icon: Building },
  { id: "mobile", name: "Mobile Payment", icon: Smartphone },
];

const InputField = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500"></span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-sm"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200 active:scale-[.98] focus:ring-2 focus:ring-gray-300 text-sm"
  >
    Back
  </button>
);

const SummaryRow = ({ label, value, color = "text-gray-800" }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className={`font-semibold ${color}`}>{value}</span>
  </div>
);

import { createDonation } from "../Service/apiService";

const DonationForm = ({ cause, onBackToCauses }) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const Icon = cause.icon;

  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmount = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(value);
    if (value) setAmount(parseInt(value));
    else setAmount(0);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        donor_name: donorInfo.anonymous ? "Anonymous" : donorInfo.name,
        donor_email: donorInfo.email,
        amount: currentAmount,
        currency: "USD",
        message: `Donation for ${cause.title}`,
        payment_method: paymentMethod,
        is_recurring: isRecurring,
        frequency: isRecurring ? frequency : null,
      };

      await createDonation(payload);
      setStep(4);
    } catch (err) {
      console.error(err);
      setError("Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentAmount = useMemo(
    () => (customAmount ? parseInt(customAmount) : amount),
    [customAmount, amount]
  );
  const isAmountValid = currentAmount > 0;
  const isDonorInfoValid = donorInfo.name && donorInfo.email;
  const isCardPaymentValid =
    paymentInfo.cardNumber &&
    paymentInfo.expiry &&
    paymentInfo.cvv &&
    paymentInfo.nameOnCard;
  const isPaymentValid = paymentMethod !== "card" || isCardPaymentValid;

  const StepHeader = ({ stepNum, title, isCurrent }) => (
    <div
      className={`flex items-center gap-2 ${isCurrent ? "font-bold" : "font-medium text-white/70"
        }`}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all text-xs ${isCurrent
          ? "bg-white text-emerald-600 border-white"
          : "bg-transparent text-white border-white/50"
          }`}
      >
        {isCurrent ? stepNum : stepNum}
      </div>
      <span className="hidden sm:block text-xs">{title}</span>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-xl mb-6 shadow-lg sticky top-4 z-10">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToCauses}
              className="text-white hover:bg-white/20 p-1 rounded-full transition-colors active:scale-95"
              aria-label="Back to causes"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{cause.title}</h2>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center w-full">
          <StepHeader stepNum={1} title="Amount" isCurrent={step === 1} />
          <div
            className={`h-1 flex-1 mx-2 rounded-full transition-all ${step > 1 ? "bg-white" : "bg-white/30"
              }`}
          ></div>
          <StepHeader stepNum={2} title="Details" isCurrent={step === 2} />
          <div
            className={`h-1 flex-1 mx-2 rounded-full transition-all ${step > 2 ? "bg-white" : "bg-white/30"
              }`}
          ></div>
          <StepHeader
            stepNum={<Check className="w-4 h-4" />}
            title="Payment"
            isCurrent={step === 3}
          />
          <div
            className={`h-1 flex-1 mx-2 rounded-full transition-all ${step > 3 ? "bg-white" : "bg-white/30"
              }`}
          ></div>
          <StepHeader
            stepNum={<Check className="w-4 h-4" />}
            title="Complete"
            isCurrent={step === 4}
          />
        </div>
      </div>

      <div className="p-4 bg-white rounded-xl shadow-xl">
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-gray-900">Select Amount</h3>
            <div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleAmountSelect(preset)}
                    className={`py-3 px-1 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[.98] focus:ring-2 focus:ring-emerald-200 ${amount === preset && !customAmount
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={handleCustomAmount}
                  className="w-full pl-10 pr-3 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-base font-bold"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                />
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 text-sm">
                    Make this a recurring donation
                  </span>
                </div>
              </label>
              {isRecurring && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {["monthly", "quarterly", "yearly"].map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setFrequency(freq)}
                      className={`py-2 px-1 rounded-md text-xs font-medium capitalize transition-all active:scale-[.98] focus:ring-2 focus:ring-emerald-200 ${frequency === freq
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">
                    Your Impact
                  </h4>
                  <p className="text-gray-700 text-xs">
                    Your donation of $ {currentAmount.toLocaleString()} will
                    support {cause.title}.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!isAmountValid}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-md active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              <Check className="w-4 h-4" />
              Continue to Details
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-gray-900">
              Your Information
            </h3>

            <div className="space-y-4">
              <InputField
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={donorInfo.name}
                onChange={(e) =>
                  setDonorInfo({ ...donorInfo, name: e.target.value })
                }
                required
              />

              <InputField
                label="Email Address"
                type="email"
                placeholder="your.email@example.com"
                value={donorInfo.email}
                onChange={(e) =>
                  setDonorInfo({ ...donorInfo, email: e.target.value })
                }
                required
              />

              <InputField
                label="Phone Number (Optional)"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={donorInfo.phone}
                onChange={(e) =>
                  setDonorInfo({ ...donorInfo, phone: e.target.value })
                }
              />

              <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                <input
                  type="checkbox"
                  checked={donorInfo.anonymous}
                  onChange={(e) =>
                    setDonorInfo({
                      ...donorInfo,
                      anonymous: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                />
                <span className="text-gray-700 font-medium text-sm">
                  Make my donation anonymous
                </span>
              </label>
            </div>

            <div className="flex gap-3 pt-3">
              <BackButton onClick={() => setStep(1)} />
              <button
                onClick={() => setStep(3)}
                disabled={!isDonorInfoValid}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-md active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-gray-900">
              Payment Method & Review
            </h3>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {PAYMENT_METHODS.map((method) => {
                const MethodIcon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-all h-full text-center hover:border-emerald-500 hover:bg-emerald-50 active:scale-[.98] focus:ring-2 focus:ring-emerald-200 ${isSelected
                      ? "border-emerald-600 bg-emerald-50 shadow-sm"
                      : "border-gray-200 bg-white"
                      }`}
                  >
                    <MethodIcon
                      className={`w-5 h-5 flex-shrink-0 transition-colors ${isSelected ? "text-emerald-700" : "text-gray-500"
                        }`}
                    />
                    <p
                      className={`text-xs font-medium ${isSelected
                        ? "text-emerald-800 font-bold"
                        : "text-gray-700"
                        }`}
                    >
                      {method.name}
                    </p>
                  </button>
                );
              })}
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-bold text-gray-800 text-sm">
                  Card Details
                </h4>
                <InputField
                  label="Card Number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentInfo.cardNumber}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      cardNumber: e.target.value
                        .replace(/\s/g, "")
                        .replace(/(\d{4})/g, "$1 ")
                        .trim(),
                    })
                  }
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Expiry (MM/YY)"
                    type="text"
                    placeholder="MM/YY"
                    value={paymentInfo.expiry}
                    onChange={(e) =>
                      setPaymentInfo({ ...paymentInfo, expiry: e.target.value })
                    }
                    required
                  />
                  <InputField
                    label="CVV"
                    type="text"
                    placeholder="123"
                    value={paymentInfo.cvv}
                    onChange={(e) =>
                      setPaymentInfo({ ...paymentInfo, cvv: e.target.value })
                    }
                    required
                  />
                </div>

                <InputField
                  label="Name on Card"
                  type="text"
                  placeholder="John Doe"
                  value={paymentInfo.nameOnCard}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      nameOnCard: e.target.value,
                    })
                  }
                  required
                />
              </div>
            )}

            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 shadow-inner">
              <div className="border-b border-emerald-200 pb-2 mb-2">
                <p className="font-bold text-gray-900 text-sm">Summary</p>
              </div>
              <div className="space-y-2">
                <SummaryRow
                  label="Cause"
                  value={cause.title}
                  color="text-emerald-700"
                />
                <SummaryRow
                  label="Amount"
                  value={`$${currentAmount.toLocaleString()}`}
                />
                {isRecurring && (
                  <SummaryRow
                    label="Frequency"
                    value={
                      frequency.charAt(0).toUpperCase() + frequency.slice(1)
                    }
                  />
                )}
                <div className="flex justify-between text-base font-bold border-t border-emerald-300 pt-2 mt-2">
                  <span>Total:</span>
                  <span className="text-emerald-700">
                    ${currentAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <BackButton onClick={() => setStep(2)} />
              <button
                onClick={handleSubmit}
                disabled={!isPaymentValid}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-md active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                <Heart className="w-4 h-4" />
                Complete Donation
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center p-6">
            <Check className="w-12 h-12 text-emerald-500 mx-auto mb-4 bg-emerald-100 p-1 rounded-full animate-pulse" />
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
              Donation Successful!
            </h3>
            <p className="text-sm text-gray-700 mb-5">
              Jazāk Allāhu Khayran! Your donation of $
              {currentAmount.toLocaleString()} has been processed.
            </p>
            <button
              onClick={onBackToCauses}
              className="bg-emerald-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-md active:scale-[.98] focus:ring-2 focus:ring-emerald-300 text-sm"
            >
              Return to Causes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationForm;

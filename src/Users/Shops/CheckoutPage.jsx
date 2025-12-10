import React, { useState } from "react";
import {
  X,
  Check,
  Truck,
  Shield,
  CreditCard,
  ChevronRight,
  ArrowLeft,
  DollarSign,
  Mail,
  Package,
  ShoppingCart,
} from "lucide-react";
import LoadingSpinner from "../../Components/Common/LoadingSpinner";

const StepIndicator = ({ step, num, label, icon: Icon }) => {
  const isActive = step === num;
  const isComplete = step > num;
  const baseClasses =
    "w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold transition-all";
  const activeClasses = "bg-emerald-600 text-white shadow-md";
  const completeClasses = "bg-emerald-100 text-emerald-600 shadow-md";
  const incompleteClasses = "bg-gray-200 text-gray-500";

  return (
    <div className="flex flex-col items-center flex-1">
      <div
        className={`${baseClasses} ${isComplete
          ? completeClasses
          : isActive
            ? activeClasses
            : incompleteClasses
          }`}
      >
        {isComplete ? (
          <Check className="w-4 h-4 md:w-5 md:h-5" />
        ) : (
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
        )}
      </div>
      <span
        className={`mt-1 text-xs font-semibold text-center ${isComplete || isActive ? "text-emerald-700" : "text-gray-500"
          }`}
      >
        {label}
      </span>
    </div>
  );
};

import { createOrder } from "../Service/apiService";

export const CheckoutPage = ({ cart, onClose, onComplete, onBackToCart }) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [error, setError] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitPayment = async () => {
    setProcessing(true);
    setError("");
    try {
      const payload = {
        items: cart.map(item => ({ product_id: item.id || item._id, quantity: item.quantity })),
        shipping_address: formData,
        payment_info: { method: paymentMethod }
      };
      await createOrder(payload);
      onComplete();
    } catch (err) {
      console.error(err);
      setError("Failed to create order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const steps = [
    { num: 1, label: "Details & Shipping", icon: Truck },
    { num: 2, label: "Payment", icon: CreditCard },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-50">
      <div className="min-h-screen">
        <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 shadow-md sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
            <button
              onClick={onBackToCart}
              className="p-2 hover:bg-white/20 rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Cart</span>
            </button>
            <h1 className="text-lg font-bold">Secure Checkout</h1>
            <div className="flex items-center gap-1 text-xs sm:text-sm">
              <Shield className="w-4 h-4" />
              <span>Secure</span>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-around items-start mb-6 bg-white p-3 md:p-4 rounded-xl shadow-lg border border-gray-100">
            {steps.map((s, index) => (
              <React.Fragment key={s.num}>
                {index > 0 && (
                  <div
                    className={`h-1 w-full mt-4 mx-2 ${step > s.num - 1 ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                  ></div>
                )}
                <StepIndicator {...s} step={step} />
              </React.Fragment>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {step === 1 && (
                <div className="bg-white rounded-xl p-4 md:p-5 shadow-xl border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Contact & Shipping
                  </h2>
                  <div className="space-y-3">
                    <input
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none text-sm"
                    />
                    <input
                      name="name"
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none text-sm"
                    />
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input
                        name="address"
                        type="text"
                        placeholder="Street Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none text-sm"
                      />
                      <input
                        name="city"
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none text-sm"
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <input
                        name="state"
                        type="text"
                        placeholder="State / Region"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none text-sm"
                      />
                      <input
                        name="zip"
                        type="text"
                        placeholder="ZIP Code"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none text-sm"
                      />
                      <input
                        name="country"
                        type="text"
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                  >
                    Continue to Payment
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-xl p-4 md:p-5 shadow-xl border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Payment Method
                  </h2>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {["card", "paypal", "crypto"].map((id) => (
                      <button
                        key={id}
                        onClick={() => setPaymentMethod(id)}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${paymentMethod === id
                          ? "border-emerald-500 bg-emerald-50 shadow-inner"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        {id === "card" && (
                          <CreditCard
                            className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === id
                              ? "text-emerald-600"
                              : "text-gray-400"
                              }`}
                          />
                        )}
                        {id === "paypal" && (
                          <DollarSign
                            className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === id
                              ? "text-blue-600"
                              : "text-gray-400"
                              }`}
                          />
                        )}
                        {id === "crypto" && (
                          <Package
                            className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === id
                              ? "text-amber-600"
                              : "text-gray-400"
                              }`}
                          />
                        )}
                        <span
                          className={`text-xs font-semibold ${paymentMethod === id
                            ? "text-emerald-600"
                            : "text-gray-600"
                            }`}
                        >
                          {id.charAt(0).toUpperCase() + id.slice(1)}
                        </span>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Card Number"
                        maxLength="19"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none text-sm"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Expiry (MM/YY)"
                          maxLength="5"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none text-sm"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          maxLength="3"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod !== "card" && (
                    <div className="bg-gray-100 p-3 rounded-lg text-center text-xs text-gray-600 font-medium">
                      You will be redirected to the{" "}
                      {paymentMethod.toUpperCase()} portal to complete your
                      transaction.
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm"
                      disabled={processing}
                    >
                      <ArrowLeft className="w-4 h-4 inline mr-1" /> Back
                    </button>
                    <button
                      onClick={handleSubmitPayment}
                      disabled={processing}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <>
                          <LoadingSpinner size="small" colorClass="border-white/30 border-t-white" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Order ${total.toFixed(2)}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-4 shadow-xl border border-gray-100 sticky top-16">
                <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">
                  Order Summary
                </h3>
                <div className="space-y-1 mb-3 max-h-36 overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-xs"
                    >
                      <p className="font-semibold text-gray-700 line-clamp-1">
                        {item.name}
                        <span className="font-normal text-gray-500">
                          (x{item.quantity})
                        </span>
                      </p>
                      <p className="font-bold text-emerald-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span
                      className={`font-semibold ${shipping === 0 ? "text-emerald-600" : ""
                        }`}
                    >
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-emerald-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OrderSuccess = ({ cart, onContinueShopping }) => {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const orderNumber = `ISL-${Math.random()
    .toString(36)
    .substr(2, 9)
    .toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm md:max-w-xl w-full p-6 md:p-8 border border-gray-100">
        <div className="text-center">
          <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-5 text-sm">
            Thank you for your purchase. May Allah bless you!
          </p>
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 mb-5">
            <p className="text-xs text-gray-600 mb-0.5">Order Number</p>
            <p className="text-lg font-bold text-emerald-600">{orderNumber}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6 text-left">
            <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
              <Mail className="w-4 h-4 text-emerald-600 mb-1" />
              <p className="text-xs text-gray-700 font-semibold">
                Confirmation
              </p>
              <p className="text-xs text-gray-500">Email sent to your inbox</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
              <Truck className="w-4 h-4 text-emerald-600 mb-1" />
              <p className="text-xs text-gray-700 font-semibold">Delivery</p>
              <p className="text-xs text-gray-500">3-5 business days</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-bold text-gray-900 mb-2 border-b pb-1.5 text-sm">
              Payment Summary
            </h3>
            <div className="flex justify-between font-bold text-base">
              <span>Total Paid</span>
              <span className="text-emerald-600">${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={onContinueShopping}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md flex items-center justify-center gap-2 text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

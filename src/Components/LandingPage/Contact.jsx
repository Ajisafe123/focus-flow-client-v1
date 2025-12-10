import React, { useState } from "react";
import { Mail, MessageCircle, Globe, Headphones, Send } from "lucide-react";
import apiService from "../Service/apiService";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    try {
      const data = await apiService.sendContactMessage(formData);
      setSuccess(data?.message || "Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setSuccess("Failed to send message.");
    }
    setLoading(false);
  };

  return (
    <section id="contact" className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-emerald-100 rounded-full border border-emerald-200">
            <span className="text-emerald-700 font-semibold text-sm md:text-base uppercase">
              Connect With Us
            </span>
          </div>
          <h2 className="header-text text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            <span className="text-black">Let's Start </span>
            <span className="text-emerald-800">a Conversation</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            We're here to support your spiritual journey with guidance, answers,
            and a welcoming community.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Headphones className="w-6 h-6 text-emerald-600" /> How We Can
              Help
            </h3>
            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  title: "Email Support",
                  text: "support@nibrasaldeen.com",
                  sub: "Response within 24h",
                },
                {
                  icon: MessageCircle,
                  title: "Live Chat",
                  text: "Instant connection with our support team",
                },
                {
                  icon: Headphones,
                  title: "Spiritual Guidance",
                  text: "Book personalized one-on-one sessions",
                },
                {
                  icon: Globe,
                  title: "Knowledge Base",
                  text: "Explore our extensive library of resources",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition-all duration-200"
                >
                  <div className="flex-shrink-0 p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-700 mb-1 text-base md:text-lg">
                      {item.title}
                    </p>
                    <p className="text-gray-700 text-base md:text-lg">
                      {item.text}
                    </p>
                    {item.sub && (
                      <p className="text-gray-500 text-sm md:text-base">
                        {item.sub}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Send className="w-6 h-6 text-emerald-600" /> Send a Message
            </h3>
            <div className="space-y-4">
              {["name", "email", "subject"].map((field) => (
                <div key={field}>
                  <label className="block text-gray-700 text-sm md:text-base font-semibold mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-base md:text-lg"
                    placeholder={`Enter your ${field}`}
                  />
                </div>
              ))}
              <div>
                <label className="block text-gray-700 text-sm md:text-base font-semibold mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none outline-none text-base md:text-lg"
                  placeholder="Share your thoughts with us..."
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-lg font-bold text-lg md:text-xl shadow transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
              >
                <span>{loading ? "Sending..." : "Send Message"}</span>{" "}
                <Send className="w-4 h-4" />
              </button>
              {success && (
                <p className="text-center text-green-600 font-semibold mt-2">
                  {success}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 px-6 py-3 bg-white rounded-xl border border-gray-200 shadow-sm text-sm md:text-base">
            <p className="text-gray-700 font-medium">Available 24/7</p>
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <p className="text-gray-700 font-medium">Avg response: 2h</p>
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <p className="text-gray-700 font-medium">Multilingual support</p>
          </div>
        </div>
      </div>
    </section>
  );
}

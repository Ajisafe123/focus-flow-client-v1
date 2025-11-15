import React from "react";
import { Shield, Lock, Eye, FileText, Clock, Globe } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <Shield className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg">
            Last updated: November 15, 2025
          </p>
        </div>

        <div className="p-8 md:p-12 space-y-10">
          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                <Eye className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Welcome to Nibras al-Deen. We are committed to protecting your
                  privacy and ensuring your personal information is handled with
                  care and respect. This Privacy Policy explains how we collect,
                  use, and safeguard your data when you use our Islamic
                  platform.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Information We Collect
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p className="font-semibold text-gray-900">
                    Personal Information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Name and email address when you register</li>
                    <li>Prayer time preferences and location data</li>
                    <li>Community engagement and participation records</li>
                  </ul>
                  <p className="font-semibold text-gray-900 mt-4">
                    Usage Information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Pages visited and features used</li>
                    <li>Device and browser information</li>
                    <li>IP address and general location</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                <Lock className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  How We Use Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Provide accurate prayer times for your location</li>
                  <li>Enhance your learning experience with Islamic content</li>
                  <li>Send notifications about community events and updates</li>
                  <li>Improve our platform and services</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                <Globe className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Cookies and Tracking
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We use cookies and similar technologies to enhance your
                  experience. Cookies help us:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze site traffic and user behavior</li>
                  <li>Personalize content and features</li>
                  <li>Provide targeted educational resources</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  You can control cookie settings through your browser
                  preferences.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Data Security
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement industry-standard security measures to protect
                  your personal information from unauthorized access,
                  disclosure, alteration, or destruction. However, no internet
                  transmission is completely secure, and we cannot guarantee
                  absolute security.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Your Rights
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Access your personal information</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Third-Party Services
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We may use third-party services for analytics, prayer time
                  calculations, and content delivery. These services have their
                  own privacy policies, and we encourage you to review them. We
                  do not sell your personal information to third parties.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                <Globe className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Changes to This Policy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. Any
                  changes will be posted on this page with an updated revision
                  date. We encourage you to review this policy periodically.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions or concerns about this Privacy Policy,
              please contact us at:
            </p>
            <div className="bg-emerald-50 rounded-xl p-6">
              <p className="text-gray-900 font-semibold mb-2">Nibras al-Deen</p>
              <p className="text-gray-700">Email: privacy@nibrasaldeen.com</p>
              <p className="text-gray-700">Address: [Your Address]</p>
            </div>
          </section>

          <div className="text-center pt-6">
            <p className="text-sm text-gray-500">
              © 2025 Nibras al-Deen. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#13111C] py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-gray-400">Last updated: January 11, 2024</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <section className="bg-purple-900/10 p-6 rounded-lg border border-purple-500/20">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p className="text-gray-300">
                We collect information you provide directly to us when you:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Create an account</li>
                <li>Upload educational content</li>
                <li>Generate assignments</li>
                <li>Contact our support team</li>
              </ul>
            </section>

            <section className="bg-purple-900/10 p-6 rounded-lg border border-purple-500/20">
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-300">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Provide and improve our services</li>
                <li>Personalize your learning experience</li>
                <li>Send you important updates and notifications</li>
                <li>Analyze and enhance our platform's performance</li>
              </ul>
            </section>

            <section className="bg-purple-900/10 p-6 rounded-lg border border-purple-500/20">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Data Security</h2>
              <p className="text-gray-300">
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure. We strive to protect your data but cannot guarantee absolute security.
              </p>
            </section>

            <section className="bg-purple-900/10 p-6 rounded-lg border border-purple-500/20">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Your Rights</h2>
              <p className="text-gray-300">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
              </ul>
            </section>

            <section className="bg-purple-900/10 p-6 rounded-lg border border-purple-500/20">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Contact Us</h2>
              <p className="text-gray-300">
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                <a href="mailto:privacy@taklif.ai" className="text-purple-400 hover:text-purple-300">
                  privacy@taklif.ai
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
"use client";

import { motion } from "framer-motion";

export default function TermsOfUse() {
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
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Use</h1>
            <p className="text-gray-400">Last updated: January 11, 2024</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <section className="bg-purple-900/10 p-6 rounded-lg border border-purple-500/20">
              <h2 className="text-2xl font-semibold text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-300">
                By accessing and using Taklif.AI, you accept and agree to be
                bound by these Terms of Use. If you do not agree to these terms,
                please do not use our service.
              </p>
              <br></br>
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. User Accounts
              </h2>
              <p className="text-gray-300">
                When creating an account, you must:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
              <br></br>

              <h2 className="text-2xl font-semibold text-white mb-4">
                3. Intellectual Property
              </h2>
              <p className="text-gray-300">
                All content generated through our platform is subject to the
                following terms:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Users retain rights to their uploaded content</li>
                <li>AI-generated assignments are for personal use only</li>
                <li>Sharing or reselling generated content is prohibited</li>
                <li>
                  Our platform and its features are protected by copyright
                </li>
              </ul>
              <br></br>

              <h2 className="text-2xl font-semibold text-white mb-4">
                4. Prohibited Activities
              </h2>
              <p className="text-gray-300">Users must not:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Upload harmful or malicious content</li>
                <li>Attempt to breach system security</li>
                <li>Use the service for unauthorized purposes</li>
                <li>Interfere with other users' access</li>
              </ul>
              <br></br>

              <h2 className="text-2xl font-semibold text-white mb-4">
                5. Termination
              </h2>
              <p className="text-gray-300">
                We reserve the right to terminate or suspend access to our
                service immediately, without prior notice, for any violation of
                these Terms of Use.
              </p>
              <br></br>

              <h2 className="text-2xl font-semibold text-white mb-4">
                6. Contact
              </h2>
              <p className="text-gray-300">
                For questions about these Terms of Use, please contact:
                <br />
                <a
                  href="mailto:legal@taklif.ai"
                  className="text-purple-400 hover:text-purple-300"
                >
                  legal@taklif.ai
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";

export function HomeHero() {
  return (
    <section>
      {/* Hero Section */}
      <div className="relative min-h-screen bg-white dark:bg-[#13111C] overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent dark:from-purple-900/20" />

        {/* Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-32 sm:h-32 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-12 h-12 sm:w-24 sm:h-24 bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-xl animate-pulse delay-700" />
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 sm:w-40 sm:h-40 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-xl animate-pulse delay-500" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-8 sm:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6 lg:space-y-8">
              {/* AI-Powered Learning Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/20 backdrop-blur-sm border border-purple-200 dark:border-purple-500/20">
                <Sparkles className="h-4 w-4 text-sm text-purple-700 dark:text-purple-300" />
                <span className="text-sm text-purple-700 dark:text-purple-300">&nbsp; AI-Powered Learning</span>
              </div>

              {/* Main Logo */}
              <div className="flex justify-center lg:justify-start mb-6 lg:mb-8 w-[250px] sm:w-[350px] mx-auto lg:mx-0">
                <Logo />
              </div>

              {/* Hero Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-purple-500">Transform Learning</span>{" "}
                <span className="text-gray-900 dark:text-white">with Personalized</span>
                <br />
                <span className="text-gray-900 dark:text-white"> Assignments</span>
              </h1>

              {/* Hero Description */}
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0">
                Upload any educational content and let our AI generate tailored
                assignments that match your interests, difficulty level, and learning style.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6 lg:mt-8">
                <Link href="/assignment-personalization" className="w-full sm:w-auto">
                  <Button size="lg" className="rounded-full w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-gray-1000 dark:text-white">
                    Create Your First Assignment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#magic"  className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto text-gray-900 dark:text-white">
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - Floating Character */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 to-transparent rounded-full blur-3xl" />
              <motion.div
                initial={{ y: 0 }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <div className="w-[500px] h-[500px]  relative">
                  <div className="absolute  inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-2xl" />
                  <motion.div
                    initial={{ rotate: -10, x: -20 }}
                    animate={{ rotate: 10, x: 20 }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  >
                    <Image
                      src="/Character.svg"
                      alt="Taklif.ai Logo"
                      width={500}
                      height={500}
                      priority
                      className="object-contain  "
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function HomeCTA() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent dark:from-purple-900/20" />

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto flex flex-col items-center gap-8">
        {/* Badge */}
        <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/20 backdrop-blur-sm border border-purple-200 dark:border-purple-500/20">
          <Sparkles className="h-4 w-4 text-sm text-purple-700 dark:text-purple-300" />
          <span className="text-xs sm:text-sm text-purple-700 dark:text-purple-300">
            &nbsp; Start experiencing personalized assignments now!
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center">
          <span className="text-purple-500 block">Ready to Transform</span>
          <span className="text-gray-900 dark:text-white block mt-4">Your Learning Experience?</span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl text-center">
        Be among the first to experience AI-powered personalized assignments.
        </p>

        {/* Button */}
        <div className="mt-6 lg:mt-8">
          <Link href="/assignment-personalization">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full w-full sm:w-auto text-gray-900 dark:text-white"
              >
              Personalize Your First Assignment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

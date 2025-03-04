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
      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left space-y-6 lg:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center justify-center px-4 py-2 sm:mb-8 rounded-full bg-purple-100 dark:bg-purple-900/20 backdrop-blur-sm border border-purple-200 dark:border-purple-500/20">
            <Sparkles className="h-4 w-4 text-sm text-purple-700 dark:text-purple-300" />
            <span className="text-sm text-purple-700 dark:text-purple-300">
              &nbsp; Start creating personalized assignments today
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="text-purple-500">Ready to Transform</span>
            <br />
            <span className="text-gray-900 dark:text-white">
              Your Learning
            </span>{" "}
            <br />
            <span className="text-gray-900 dark:text-white">Experience?</span>
          </h1>
          {/* Description */}
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0">
            Join thousands of educators and students who are already benefiting
            from AI-powered personalized assignments.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6 lg:mt-8">
            <Link
              href="/assignment-personalization"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="rounded-full w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-gray-1000 dark:text-white"
              >
                Create Your First Assignment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full w-full sm:w-auto text-gray-900 dark:text-white"
              >
                Watch On Youtube
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Content - YouTube Video */}
        <div className="flex-1 w-full max-w-[600px] lg:max-w-none">
          <div className="relative aspect-video group">
            {/* Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-1 shadow-lg">
              <div className="relative w-full h-full bg-[#13111C] rounded-lg overflow-hidden">
                {/* YouTube Video Embed */}
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/SJKeDG8lw04?si=fgx6geCcSf97NSfl&amp;controls=0" // Replace VIDEO_ID with your YouTube video ID
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

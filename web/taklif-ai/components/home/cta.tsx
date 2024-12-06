"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function HomeCTA() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-700" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center p-1 mb-8 bg-white/10 backdrop-blur-sm rounded-full">
          <span className="px-4 py-1.5 text-sm font-medium text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Start creating personalized assignments today
          </span>
        </div>

        <h2 className="text-4xl font-bold mb-4 text-white">
          Ready to Transform Your Learning Experience?
        </h2>
        <p className="text-xl mb-8 text-white/90">
          Join thousands of educators and students who are already benefiting from AI-powered personalized assignments.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
          <Link href="/assignment-generation">
            <Button size="lg" className="w-full sm:w-auto bg-white text-violet-600 hover:bg-white/90">
              Create Your First Assignment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button
            size="lg"
            className="w-full sm:w-auto bg-white text-violet-600 hover:bg-white/90"
          >
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
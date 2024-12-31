"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    title: "Upload PDF",
    description: "Simply upload your educational content",
    color: "from-violet-600 to-violet-400"
  },
  {
    title: "AI Analysis",
    description: "Our AI analyzes and understands the content",
    color: "from-fuchsia-600 to-pink-400"
  },
  {
    title: "Generation",
    description: "Creates personalized assignments instantly",
    color: "from-purple-600 to-purple-400"
  }
];

export function HomeMagic() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNextStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 mb-8 bg-violet-100 dark:bg-violet-900/30 rounded-full">
            <Wand2 className="h-5 w-5 text-violet-600 dark:text-violet-400 mr-2" />
            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
              Experience the Magic
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
            See How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch our AI transform your content into engaging assignments in seconds
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-background">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-2">
                    <h3 className={`text-2xl font-bold bg-gradient-to-r ${steps[currentStep].color} bg-clip-text text-transparent`}>
                      {steps[currentStep].title}
                    </h3>
                    <p className="text-muted-foreground">
                      {steps[currentStep].description}
                    </p>
                  </div>
                  <div className={`p-4 rounded-full bg-gradient-to-br ${steps[currentStep].color}`}>
                    <Wand2 className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleNextStep}
                    disabled={isAnimating}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    See Next Step
                  </Button>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
                  currentStep === index
                    ? "bg-violet-600 scale-125"
                    : "bg-violet-200 dark:bg-violet-800"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
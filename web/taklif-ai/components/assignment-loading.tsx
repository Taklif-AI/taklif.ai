"use client";

import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const sentences = [
  "Analyzing your unique interest...",
  "Tailoring assignment content uniquely for you...",
  "Integrating engaging topics with learning objectives...",
];

export default function AssignmentLoading() {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [simplification, setSimplification] = useState(false);

  useEffect(() => {
    const simplify = sessionStorage.getItem("fromSimplify");

    if (simplify) {
      setSimplification(true);
    }
  }, []);

  useEffect(() => {
    document.title = simplification ? "Simplifying..." : "Personalizing...";
  }, [simplification]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSentence((prev) => (prev + 1) % sentences.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <Card className="p-12 text-center space-y-8 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/5 dark:to-background backdrop-blur-sm">
            <div className="ml-auto mr-auto w-[10rem]">
              <object
                data="/logo-animation.gif"
                type="image/gif"
                width="150"
                height="150"
              >
                Your browser does not support SVGs.
              </object>
            </div>

            <div className="space-y-4">
              <motion.h1
                className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                {simplification ? "Simplifying" : "Personalizing"} Your Assignment
              </motion.h1>

              <p className="text-lg text-muted-foreground">
                We're {simplification ? "simplifying" : "personalizing"} a
                unique assignment tailored to your interests
              </p>
            </div>

            <div className="pt-4 space-y-2 text-base text-muted-foreground h-20 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentSentence}
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className="absolute w-full text-center"
                >
                  {sentences[currentSentence]}
                </motion.p>
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
"use client";

import { Card } from "@/components/ui/card";
import { Sparkles, Brain, Wand2, Stars } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
const backgroundIcons = [Brain, Wand2, Stars, Sparkles];

export default function AssignmentLoadingPage() {
  const router = useRouter();
  useEffect(() => {
    document.title = "Loading...";
  }, []);
  useEffect(() => {
    const allow = sessionStorage.getItem("allowLoadingPage");
    if (!allow) {
      router.push("/");
    }
  }, [router]);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Animated Background Icons */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            {backgroundIcons.map((Icon, index) => (
              <motion.div
                key={index}
                className="absolute text-violet-100 dark:text-violet-900/20"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 0.5,
                  scale: 1,
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 2,
                }}
              >
                <Icon size={64} />
              </motion.div>
            ))}
          </div>

          <Card className="p-12 text-center space-y-8 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-background backdrop-blur-sm border-violet-100 dark:border-violet-800">
            <div className=" ml-auto	mr-auto	 w-[10rem]">
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
                transition={{ duration: 2, repeat: Infinity }}
              >
                AI Magic in Progress
              </motion.h1>
              <p className="text-lg text-muted-foreground">
                Our AI is crafting the perfect assignment just for you...
              </p>
            </div>

            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-4 bg-gradient-to-r from-violet-400 to-violet-600 dark:from-violet-700 dark:to-violet-900 rounded-full"
                  initial={{ width: "10%", opacity: 1 }}
                  animate={{
                    width: ["10%", "100%", "100%", "10%"], // Smooth reset to starting point
                    opacity: [1, 1, 0, 0], // Stays invisible before restarting
                  }}
                  transition={{
                    duration: 3, // Smooth transition time
                    ease: "easeInOut", // Natural movement
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: i * 0.5, // Staggered start times
                    repeatDelay: 0.5, // Ensures no flash when restarting
                  }}
                />
              ))}
            </div>

            <div className="pt-4 space-y-2 text-sm text-muted-foreground">
              <p>Analyzing content structure...</p>
              <p>Generating personalized questions...</p>
              <p>Applying educational frameworks...</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

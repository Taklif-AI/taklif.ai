"use client";

import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Brain, Wand2, Stars } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import SVGIMG from "../../../../public/Taklif.AI Icon.svg";

const backgroundIcons = [Brain, Wand2, Stars, Sparkles];

export default function AssignmentLoadingPage() {
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
            <motion.div 
              className="flex justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="relative">
                <div className="absolute inset-0">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
              <Image className="w-48" src={SVGIMG} alt={""} />
            </motion.div>
                </div>
                <Loader2 className="w-16 h-16 invisible animate-spin text-violet-600 dark:text-violet-400" />
              </div>
            </motion.div>
            
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
                  className="h-2 bg-gradient-to-r from-violet-200 to-violet-100 dark:from-violet-800 dark:to-violet-900 rounded-full"
                  initial={{ width: "20%" }}
                  animate={{ width: ["20%", "100%", "20%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
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
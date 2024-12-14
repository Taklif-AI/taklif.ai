"use client";

import { useState, useEffect } from "react";
import { AssignmentResult } from "@/components/assignment/additional-components/assigment-res";
import { AssignmentActions } from "@/components/assignment/additional-components/assigment-action";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Assignment } from "@/lib/utils/assigment-typs";
import { Toast } from "@/lib/utils/toast";
import { motion } from "framer-motion";
import { Brain, Sparkles, Stars, Wand2 } from "lucide-react";

const backgroundIcons = [Brain, Wand2, Stars, Sparkles];

export default function AssignmentResultPage() {
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    const mockAssignment: Assignment = {
      id: Date.now().toString(),
      title: "Introduction to Physics",
      text: "Create a comprehensive explanation of Newton's laws of motion with practical examples from everyday life. Include mathematical formulas and their applications.",
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0
    };
    setAssignment(mockAssignment);
  }, []);

  const handleAction = (action: 'like' | 'dislike' | 'regenerate' | 'simplify') => {
    if (!assignment) return;

    switch (action) {
      case 'like':
        setAssignment(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
        Toast.success("Assignment liked!");
        break;
      case 'dislike':
        setAssignment(prev => prev ? { ...prev, dislikes: prev.dislikes + 1 } : null);
        Toast.success("Feedback recorded");
        break;
      case 'regenerate':
        Toast.success("Regenerating assignment...");
        router.push('/assignment/loading');
        break;
      case 'simplify':
        Toast.success("Simplifying assignment...");
        break;
    }
  };

  if (!assignment) return null;

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden backdrop-blur-sm border-violet-100 dark:border-violet-800">
              <div className="p-8 space-y-6 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-background relative">
                <div className="absolute top-0 right-0 p-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 text-violet-400 dark:text-violet-600" />
                  </motion.div>
                </div>

                <AssignmentResult assignment={assignment} />
                <AssignmentActions 
                  assignment={assignment}
                  onAction={handleAction}
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
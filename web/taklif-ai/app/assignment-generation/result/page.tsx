"use client";

import { useState, useEffect } from "react";
import { AssignmentResult } from "@/components/assignment/additional-components/assignment-res";
import { AssignmentActions } from "@/components/assignment/additional-components/assignment-action";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Assignment } from "@/lib/types/assigment-type";
import { Toast } from "@/lib/utils/toast";
import { motion } from "framer-motion";
import { Brain, Sparkles, Stars, Wand2 } from "lucide-react";
import { storage } from "@/lib/utils/local-storage";
const backgroundIcons = [Brain, Wand2, Stars, Sparkles];

export default function AssignmentResultPage() {
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    const lastCreatedId = localStorage.getItem('lastCreatedAssignmentId');
    if (!lastCreatedId) return;
    const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    const foundAssignment = assignments.find((a) => a.id === lastCreatedId);
    setAssignment(foundAssignment);
  }, []);

  const handleAction = async (action: 'like' | 'dislike' | 'regenerate' | 'simplify') => {
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
        // redirect user to loadings page
        router.push('/assignment-generation/loading/');
        try {
          const lastRequestData = localStorage.getItem('lastRequestData');
          if (!lastRequestData) {
            Toast.error('No previous request data found.');
            router.push('/assignment-generation/result');
            return;
          }
          const dataToBackend = JSON.parse(lastRequestData);
          // send the assignment to the backend
          const res = await fetch('/api/assignment-generation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToBackend)

          });

          const result = await res.json();
          // check the incoming response
          if (!res.ok || !result || result.error) {
            Toast.error(result.error ? result.error : "Failed to generate assignment. Please try again.");
            router.push('/assignment-generation');
            return;
          }
          const data = JSON.parse(result.customized_assignment)

          const newAssignment = {
            id: Date.now().toString(),
            title: data.assignment_title,
            createdAt: new Date().toISOString(),
            interest: dataToBackend.student_interest,
            text: data.assignment_content,
            type: 're-generated',
            likes: 0,
            dislikes: 0
          };

          const existingAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
          localStorage.setItem('assignments', JSON.stringify([...existingAssignments, newAssignment]));
          localStorage.setItem('lastCreatedAssignmentId', newAssignment.id);
          localStorage.setItem('lastRequestData', JSON.stringify(dataToBackend));
          storage.clearProgress();

          Toast.success("Assignment re-generated successfully!");
          router.push('/assignment-generation/result/');
        } catch (error) {
          console.log(error);
          Toast.error("Failed to create assignment. Please try again.2");
          router.push('/assignment-generation/result/');
        }
        break;
      case 'simplify':
        Toast.success("Simplifying assignment...");


        // redirect user to loadings page
        router.push('/assignment-generation/loading/');

        try {
          const res = await fetch('/api/assignment-simplification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(assignment),
          });

          const result = await res.json();
          // check the incoming response
          if (!res.ok || !result || result.error) {
            Toast.error(result.error ? result.error : "Failed to simplify assignment. Please try again.");
            router.push('/assignment-generation');
            return;
          }
          console.log(result);
          
          const data = JSON.parse(result.simplified_assignment)

          const newAssignment = {
            id: Date.now().toString(),
            title: data.assignment_title,
            createdAt: new Date().toISOString(),
            interest: assignment.interest,
            text: data.assignment_content,
            type: 'simplified',
            likes: 0,
            dislikes: 0
          };

          const existingAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
          localStorage.setItem('assignments', JSON.stringify([...existingAssignments, newAssignment]));
          localStorage.setItem('lastCreatedAssignmentId', newAssignment.id);
          storage.clearProgress();

          Toast.success("Assignment simplified successfully!");
          router.push('/assignment-generation/result/');
          /* eslint-disable */
        } catch (error) {
          Toast.error("Failed to simplified assignment. Please try again");
          router.push('/assignment-generation/result/');
        }
        /* eslint-enable */

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
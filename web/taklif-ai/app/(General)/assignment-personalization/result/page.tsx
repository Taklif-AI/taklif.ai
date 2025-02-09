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
import Image from "next/image";
import SVGIMG from "../../../../public/Taklif.AI Icon.svg";
const backgroundIcons = [Brain, Wand2, Stars, Sparkles];
import {  ChevronRight , ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AssignmentResultPage() {
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  useEffect(() => {
    const lastCreatedId = localStorage.getItem('lastCreatedAssignmentId');
    if (!lastCreatedId) return;
    const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    const foundAssignment = assignments.find((a) => a.id === lastCreatedId);
    setAssignment(foundAssignment);
  }, []);
  const handleNavigateLeft = () => {
    // Logic to navigate to the previous version
  };
  
  const handleNavigateRight = () => {
    // Logic to navigate to the next version
  };
  const handleAction = async (action: 'like' | 'dislike' | 'repersonalized' | 'simplify') => {
    if (!assignment) return;

    switch (action) {
      case 'like':
        setAssignment(prev => prev ? { ...prev, like: true, dislike: false } : null);
        Toast.success("Assignment liked!");
        break;
      case 'dislike':
        setAssignment(prev => prev ? { ...prev, dislike: true, like: false } : null);
        Toast.success("Feedback recorded!");
        break;
      case 'repersonalized':
        setIsPending(true)
        Toast.success("repersonaling assignment...");
        // redirect user to loadings page
        router.push('/assignment-personalization/loading/');
        try {
          const lastRequestData = localStorage.getItem('lastRequestData');
          if (!lastRequestData) {
            Toast.error('No previous request data found.');
            router.push('/assignment-personalization/result');
            return;
          }
          const dataToBackend = JSON.parse(lastRequestData);
          // send the assignment to the backend
          const res = await fetch('/api/assignment-personalization', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToBackend)

          });

          const result = await res.json();
          // check the incoming response
          if (!res.ok || !result || result.error) {
            Toast.error(result.error);
            router.push('/assignment-personalization');
            return;
          }
          const data = JSON.parse(result.customized_assignment)

          const newAssignment = {
            id: Date.now().toString(),
            title: data.assignment_title,
            createdAt: new Date().toISOString(),
            interest: dataToBackend.student_interest,
            text: data.assignment_content,
            type: 're-personalized',
            likes: 0,
            dislikes: 0
          };

          const existingAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
          localStorage.setItem('assignments', JSON.stringify([...existingAssignments, newAssignment]));
          localStorage.setItem('lastCreatedAssignmentId', newAssignment.id);
          localStorage.setItem('lastRequestData', JSON.stringify(dataToBackend));
          storage.clearProgress();

          Toast.success("Assignment re-personalized successfully!");
          router.push('/assignment-personalization/result/');
          setIsPending(false);
        } catch (error) {
          console.log(error);
          Toast.error("Failed to create assignment. Please try again.2");
          router.push('/assignment-personalization/result/');
        }
        break;
      case 'simplify':
        setIsPending(true);
        Toast.success("Simplifying assignment...");


        // redirect user to loadings page
        router.push('/assignment-personalization/loading/');

        try {
          const res = await fetch('/api/assignment-simplification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(assignment),
          });

          // check the incoming response
          if (!res.ok) {
            Toast.error("Failed to simplify assignment. Please try again.1");
            router.push('/assignment-personalization/result');
            return;
          }

          const result = await res.json();
          // check the parsed result
          if (!result || result.error) {
            Toast.error(result.error);
            router.push('/assignment-personalization/result');
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
          router.push('/assignment-personalization/result/');
          setIsPending(false);
          /* eslint-disable */
        } catch (error) {
          Toast.error("Failed to simplified assignment. Please try again");
          router.push('/assignment-personalization/result/');
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
                <AssignmentResult assignment={assignment} />
                <motion.div
        className="flex justify-between mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
    <motion.div
      className=" bottom-4 left-4 flex space-x-4" // Positioning for left arrow
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
       <Button
            variant="ghost"
            size="sm"
            className="text-violet-600 hover:rounded-full hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20"
          >

      <ChevronLeft className="cursor-pointer" onClick={handleNavigateLeft} />
      </Button>
    </motion.div>

    <motion.div
      className=" bottom-4 right-4 flex " // Positioning for right arrow
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
        <Button
            variant="ghost"
            size="sm"
            className="text-violet-600 hover:rounded-full hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20"
          >

      <ChevronRight className="cursor-pointer" onClick={handleNavigateRight} />
          </Button>
    </motion.div>
                </motion.div>
                <AssignmentActions
                  isPending={isPending}
                  assignment={assignment}
                  onAction={handleAction}
                />
              </div>
            </Card>
          </motion.div>
        </div>
        <div>

          <div className="m-5 flex justify-between">
            
        <Link href="/" >
        <Button
                variant="ghost"
                className="rounded-full w-full outline outline-1 hover:bg-purple-600 hover:text-white transition-colors hover:outline-none"
              >
                Home Page
              </Button>
        </Link>
        <Link href="/assignment-personalization/all-assignments"  >
        <Button
                variant="ghost"
                className="rounded-full w-full outline outline-1 hover:bg-purple-600 hover:text-white transition-colors hover:outline-none"
              >
                All Assignments
              </Button>
        </Link>
        </div>

        </div>
      </div>
    </div>
  );
}
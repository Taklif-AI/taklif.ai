"use client";

import { useState, useEffect } from "react";
import { AssignmentResult } from "@/components/assignment/additional-components/assignment-res";
import { AssignmentActions } from "@/components/assignment/additional-components/assignment-action";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Toast } from "@/lib/utils/toast";
import { motion } from "framer-motion";
import { Brain, Sparkles, Stars, Wand2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchAssignment } from "@/actions/get-assignment";
import { Assignment } from "@/lib/types/assigment-type";
import Link from "next/link";
const backgroundIcons = [Brain, Wand2, Stars, Sparkles];

export default function AssignmentResultPage() {
  const router = useRouter();

  const [DbAssignment, setDbAssignment] = useState<Assignment | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAssignment() {
      try {
        const run_id = sessionStorage.getItem("run_id");
        const personalization_id = sessionStorage.getItem("personalization_id");
        const simplification_id = sessionStorage.getItem("simplification_id") || undefined;
        if (!run_id || !personalization_id) {
          Toast.error("Missing required data. Redirecting...");
          router.push('/assignment-personalization');
          return;
        }

        const result = await fetchAssignment(
          run_id as string,
          personalization_id as string,
          simplification_id
        );
        if (result?.error) {
          Toast.error(result.error);
          return;
        }
        if (result?.data) {
          setDbAssignment(result.data as Assignment);

          const storedFeedback = localStorage.getItem("assignment_feedback");
          if (storedFeedback) {
            setDbAssignment((prev) => (prev ? { ...prev, feedback: JSON.parse(storedFeedback) } : null));
          }
        }
      } catch (error) {
        console.log("Error fetching assignment:", error);
        Toast.error("Failed to fetch assignment data.");
      } finally {
        setIsLoading(false);
      }
    }
    getAssignment();
  }, [router]);

  const handleNavigateLeft = () => {
    // Logic to navigate to the previous version
  };

  const handleNavigateRight = () => {
    // Logic to navigate to the next version
  };
  const handleAction = async (action: 'like' | 'dislike' | 'copied' | 'repersonalized' | 'simplify') => {
    if (!DbAssignment) return;

    const timestamp = new Date().toISOString();
    const updatedFeedback = { ...DbAssignment.feedback }

    switch (action) {
      case 'like':
        updatedFeedback.like = { value: true, timestamp };
        updatedFeedback.dislike = { value: false, timestamp }
        Toast.success("Assignment liked!");
        break;
      case 'dislike':
        updatedFeedback.dislike = { value: true, timestamp }
        updatedFeedback.like = { value: false, timestamp };
        Toast.success("Feedback recorded!");
        break;
      case "copied":
        updatedFeedback.copied = { value: true, timestamp };
        navigator.clipboard.writeText(DbAssignment.model_output.content);
        Toast.success("Assignment copied to clipboard!",);
        break;
      case 'repersonalized':
        setIsPending(true)
        Toast.success("Re-personalizing assignment...");
        // redirect user to loadings page
        router.push('/assignment-personalization/loading');
        try {
          const run_id = sessionStorage.getItem("run_id");
          if (!run_id) {
            Toast.error("Missing required data. Redirecting...");
            router.push('/assignment-personalization/result');
            return;
          }
          const personalization_id = uuidv4();
          const dataToBackend = {
            student_interest: DbAssignment.user_input.interest,
            general_assignment: DbAssignment.user_input.assignment,
            is_pdf: DbAssignment.user_input.is_PDF,
            run_id: run_id,
            personalization_id: personalization_id,
          }
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
            setIsPending(false);
            Toast.error(result.error);
            router.push('/assignment-personalization/result');
            return;
          }

          sessionStorage.removeItem("simplification_id");
          sessionStorage.setItem("run_id", dataToBackend.run_id);
          sessionStorage.setItem("personalization_id", dataToBackend.personalization_id);
          setIsPending(false);
          Toast.success("Assignment re-personalized successfully!");
          router.push('/assignment-personalization/result');

        } catch (error) {
          setIsPending(false);
          console.log(error);
          Toast.error("Failed to create assignment. Please try again.2");
          router.push('/assignment-personalization/result');
        }
        break;
      case 'simplify':
        setIsPending(true);
        Toast.success("Simplifying assignment...");


        // redirect user to loadings page
        router.push('/assignment-personalization/loading');

        const run_id = sessionStorage.getItem("run_id");
        const personalization_id = sessionStorage.getItem("personalization_id");
        if (!run_id || !personalization_id) {
          Toast.error("Missing required data. Redirecting...");
          router.push('/assignment-personalization/result');
          return;
        }
        const simplification_id = uuidv4();

        const dataToBackend = {
          run_id: run_id,
          personalization_id: personalization_id,
          simplification_id: simplification_id,
          interest: DbAssignment?.user_input.interest,
          personalized_assignment: DbAssignment?.model_output.content,
        }
        try {
          const res = await fetch('/api/assignment-simplification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToBackend),
          });

          const result = await res.json();

          // check the incoming response
          if (!res.ok || !result || result.error) {
            Toast.error("Failed to simplify assignment. Please try again.1");
            router.push('/assignment-personalization/result');
            return;
          }

          sessionStorage.setItem("run_id", dataToBackend.run_id);
          sessionStorage.setItem("personalization_id", dataToBackend.personalization_id);
          sessionStorage.setItem("simplification_id", dataToBackend.simplification_id);

          Toast.success("Assignment simplified successfully!");
          router.push('/assignment-personalization/result');
          setIsPending(false);
          /* eslint-disable */
        } catch (error) {
          Toast.error("Failed to simplified assignment. Please try again");
          router.push('/assignment-personalization/result/');
        }
        /* eslint-enable */

        break;
    }

    setDbAssignment((prev) => (prev ? { ...prev, feedback: updatedFeedback } : null))
    localStorage.setItem("assignment_feedback", JSON.stringify(updatedFeedback));

    try {
      const res = await fetch('/api/save-feedback', {
        method: 'POST',
        headers: { "Content-Type": 'application/json' },
        body: JSON.stringify({
          PK: DbAssignment.PK,
          SK: DbAssignment.SK,
          feedback: updatedFeedback,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result || result.error) {
        Toast.error(result.error || "Failed to save feedback.");
      }

    } catch (error) {
      console.log(error);
      Toast.error("Failed to save feedback.");
    }
  };

  if (isLoading) return null;
  if (!DbAssignment) return null;
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
                <AssignmentResult assignment={DbAssignment} />
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
                      variant="outline"
                      size="sm"
                      className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                    >

                      <ArrowLeft className="cursor-pointer" onClick={handleNavigateLeft} />
                    </Button>
                  </motion.div>

                  <motion.div
                    className=" bottom-4 right-4 flex " // Positioning for right arrow
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                    >

                      <ArrowRight className="cursor-pointer" onClick={handleNavigateRight} />
                    </Button>
                  </motion.div>
                </motion.div>
                <AssignmentActions
                  isPending={isPending}
                  assignment={DbAssignment}
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
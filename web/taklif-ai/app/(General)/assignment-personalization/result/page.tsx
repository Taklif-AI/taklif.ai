"use client";

import { useState, useEffect } from "react";
import { AssignmentResult } from "@/components/assignment/additional-components/assignment-res";
import { AssignmentActions } from "@/components/assignment/additional-components/assignment-action";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Toast } from "@/lib/utils/toast";
import { motion } from "framer-motion";
import { Brain, Sparkles, Stars, Wand2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchAllAssignmentVersions } from "@/actions/fetch-all-assignment-versions";
import { Assignment } from "@/lib/types/assigment-type";
import { useAssignments } from "@/components/providers/assignments-provider";

import Link from "next/link";
import { checkAndRenewSubscription } from "@/actions/check-update-subscription";
import { decrementRemainingCredit } from "@/actions/decrement-remaining-credit";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
const backgroundIcons = [Brain, Wand2, Stars, Sparkles];

export default function AssignmentResultPage() {
  const { update } = useSession();
  const user = useCurrentUser();
  const router = useRouter();
  const { refreshCount } = useAssignments();
  const [assignmentsStack, setAssignmentsStack] = useState<Assignment[]>([]);
  const [currentAssignmentIndex, setCurrentAssignmentIndex] =
    useState<number>(0);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAssignment() {
      try {
        const run_id = sessionStorage.getItem("run_id");
        const personalization_id = sessionStorage.getItem("personalization_id");
        const fromAllAssignments = sessionStorage.getItem("fromAllAssignments");

        if (!run_id || !personalization_id) {
          Toast.error("Missing required data. Redirecting...");
          router.push("/assignment-personalization");
          return;
        }

        const result = await fetchAllAssignmentVersions(run_id as string);
        if (result?.error) {
          Toast.error(result.error);
          return;
        }
        if (result?.data) {
          // Clear localStorage feedback when fetching new assignments
          localStorage.removeItem("assignment_feedback");

          // Sort assignments by `created_at` in descending order (most recent first)
          const sortedAssignments = result.data.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );
          setAssignmentsStack(sortedAssignments);

          let assignmentIndex = 0; // Default to the most recent assignment
          if (fromAllAssignments === "true") {
            // Find the index of the assignment with the matching personalization_id
            assignmentIndex = sortedAssignments.findIndex(
              (assignment) =>
                assignment.personalization_id === personalization_id &&
                assignment.item_type === "Personalization",
            );
            if (assignmentIndex === -1) {
              // If the assignment is not found, show an error and redirect
              Toast.error("Assignment not found. Redirecting...");
              router.push("/assignment-personalization/my-assignments");
              return;
            }
            sessionStorage.removeItem("fromAllAssignments");
          }

          // Set the current assignment index
          setCurrentAssignmentIndex(assignmentIndex);

          const storedFeedback = localStorage.getItem("assignment_feedback");
          if (storedFeedback) {
            setAssignmentsStack((prev) =>
              prev.map((assignment, index) =>
                index === assignmentIndex
                  ? { ...assignment, feedback: JSON.parse(storedFeedback) }
                  : assignment,
              ),
            );
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
    refreshCount();
  }, [router]);

  useEffect(() => {
    document.title = "Personalization Result";
  }, []);

  const handleNavigateLeft = () => {
    if (currentAssignmentIndex < assignmentsStack.length - 1) {
      // Clear localStorage feedback when navigating to a different assignment
      localStorage.removeItem("assignment_feedback");

      setCurrentAssignmentIndex(currentAssignmentIndex + 1);
    }
  };

  const handleNavigateRight = () => {
    if (currentAssignmentIndex > 0) {
      // Clear localStorage feedback when navigating to a different assignment
      localStorage.removeItem("assignment_feedback");

      setCurrentAssignmentIndex(currentAssignmentIndex - 1);
    }
  };

  const handleAction = async (
    action: "like" | "dislike" | "copied" | "repersonalized" | "simplify",
  ) => {
    const currentAssignment = assignmentsStack[currentAssignmentIndex];
    if (!currentAssignment) return;

    const timestamp = new Date().toISOString();
    const updatedFeedback = { ...currentAssignment.feedback };

    switch (action) {
      case "like":
        updatedFeedback.like = { value: true, timestamp };
        updatedFeedback.dislike = { value: false, timestamp };
        Toast.success("Assignment liked!");
        break;
      case "dislike":
        updatedFeedback.dislike = { value: true, timestamp };
        updatedFeedback.like = { value: false, timestamp };
        Toast.success("Feedback recorded!");
        break;
      case "copied":
        updatedFeedback.copied = { value: true, timestamp };
        navigator.clipboard.writeText(currentAssignment.model_output.content);
        Toast.success("Assignment copied to clipboard!");
        break;
      case "repersonalized":
        setIsPending(true);
        const check = await checkAndRenewSubscription();
        if (!check) {
          setIsPending(false);
          Toast.error("Error while checking subscription!");
          router.push("/assignment-personalization/result");
          return;
        }
        if (check.error) {
          setIsPending(false);
          Toast.error(check.error);
          router.push("/assignment-personalization/result");
          return;
        }
        if (check.renewed) {
          Toast.success(check.message);
        }
        if (check.subscription) {
          if (check.subscription.remaining_credits <= 0) {
            setIsPending(false);
            Toast.error("You have no remaining credits.");
            router.push("/assignment-personalization/result");
            return;
          }
        }

        sessionStorage.setItem("allowLoadingPage", "true");
        // redirect user to loadings page
        router.push("/assignment-personalization/loading");
        try {
          const run_id = sessionStorage.getItem("run_id");
          if (!run_id) {
            Toast.error("Missing required data. Redirecting...");
            router.push("/assignment-personalization/result");
            return;
          }
          const personalization_id = uuidv4();
          const dataToBackend = {
            student_interest: currentAssignment.user_input.interest,
            general_assignment: currentAssignment.user_input.assignment,
            is_pdf: false,
            run_id: run_id,
            personalization_id: personalization_id,
          };
          // send the assignment to the backend
          const res = await fetch("/api/assignment-personalization", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToBackend),
          });

          const result = await res.json();
          // check the incoming response
          if (!res.ok || !result || result.error) {
            setIsPending(false);
            Toast.error(result.error);
            router.push("/assignment-personalization/result");
            return;
          }

          sessionStorage.setItem("run_id", dataToBackend.run_id);
          sessionStorage.setItem(
            "personalization_id",
            dataToBackend.personalization_id,
          );

          const decrement = await decrementRemainingCredit();
          if (decrement.error) {
            Toast.error(decrement.error);
          }

          if (user?.remaining_credits) {
            const value = user.remaining_credits - 1;
            await update({
              user: {
                remaining_credits: value,
              },
            });
          }

          Toast.success("Assignment re-personalized successfully!");
          setIsPending(false);
          router.push("/assignment-personalization/result");
          sessionStorage.removeItem("allowLoadingPage");
        } catch (error) {
          setIsPending(false);
          console.log(error);
          Toast.error("Failed to create assignment. Please try again.2");
          router.push("/assignment-personalization/result");
        }
        break;
      case "simplify":
        setIsPending(true);

        const check1 = await checkAndRenewSubscription();
        if (!check1) {
          setIsPending(false);
          Toast.error("Error while checking subscription!");
          router.push("/assignment-personalization/result");
          return;
        }
        if (check1.error) {
          setIsPending(false);
          Toast.error(check1.error);
          router.push("/assignment-personalization/result");
          return;
        }
        if (check1.renewed) {
          Toast.success(check1.message);
        }
        if (check1.subscription) {
          if (check1.subscription.remaining_credits <= 0) {
            setIsPending(false);
            Toast.error("You have no remaining credits.");
            router.push("/assignment-personalization/result");
            return;
          }
        }

        sessionStorage.setItem("allowLoadingPage", "true");

        // redirect user to loadings page
        router.push("/assignment-personalization/loading");

        const run_id = sessionStorage.getItem("run_id");
        const personalization_id = sessionStorage.getItem("personalization_id");
        if (!run_id || !personalization_id) {
          Toast.error("Missing required data. Redirecting...");
          router.push("/assignment-personalization/result");
          return;
        }
        const simplification_id = uuidv4();

        const dataToBackend = {
          run_id: run_id,
          personalization_id: personalization_id,
          simplification_id: simplification_id,
          interest: currentAssignment.user_input.interest,
          personalized_assignment: currentAssignment?.model_output.content,
        };
        try {
          const res = await fetch("/api/assignment-simplification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToBackend),
          });

          const result = await res.json();

          // check the incoming response
          if (!res.ok || !result || result.error) {
            Toast.error("Failed to simplify assignment. Please try again.1");
            router.push("/assignment-personalization/result");
            return;
          }

          sessionStorage.setItem("run_id", dataToBackend.run_id);
          sessionStorage.setItem(
            "personalization_id",
            dataToBackend.personalization_id,
          );

          const decrement1 = await decrementRemainingCredit();
          if (decrement1.error) {
            Toast.error(decrement1.error);
          }

          if (user?.remaining_credits) {
            const value = user.remaining_credits - 1;
            await update({
              user: {
                remaining_credits: value,
              },
            });
          }

          Toast.success("Assignment simplified successfully!");
          setIsPending(false);
          router.push("/assignment-personalization/result");
          sessionStorage.removeItem("allowLoadingPage");
          /* eslint-disable */
        } catch (error) {
          Toast.error("Failed to simplified assignment. Please try again");
          router.push("/assignment-personalization/result/");
        }
        /* eslint-enable */

        break;
    }
    setAssignmentsStack((prev) =>
      prev.map((assignment, index) =>
        index === currentAssignmentIndex
          ? { ...assignment, feedback: updatedFeedback }
          : assignment,
      ),
    );
    // setDbAssignment((prev) => (prev ? { ...prev, feedback: updatedFeedback } : null))
    localStorage.setItem(
      "assignment_feedback",
      JSON.stringify(updatedFeedback),
    );

    try {
      const res = await fetch("/api/save-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          PK: currentAssignment.PK,
          SK: currentAssignment.SK,
          feedback: updatedFeedback,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result || result.error) {
        Toast.error(result.error || "Failed to save feedback.");
      } else {
        // Clear localStorage feedback after successfully saving to the database
        localStorage.removeItem("assignment_feedback");
      }
    } catch (error) {
      console.log(error);
      Toast.error("Failed to save feedback.");
    }
  };

  if (isLoading) return null;
  if (assignmentsStack.length === 0) return null;
  const currentAssignment = assignmentsStack[currentAssignmentIndex];
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
                <AssignmentResult assignment={currentAssignment} />
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
                    {currentAssignmentIndex < assignmentsStack.length - 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                      >
                        <ArrowLeft
                          className="cursor-pointer"
                          onClick={handleNavigateLeft}
                        />
                      </Button>
                    )}
                  </motion.div>

                  <motion.div
                    className=" bottom-4 right-4 flex " // Positioning for right arrow
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {currentAssignmentIndex > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                      >
                        <ArrowRight
                          className="cursor-pointer"
                          onClick={handleNavigateRight}
                        />
                      </Button>
                    )}
                  </motion.div>
                </motion.div>
                <AssignmentActions
                  isPending={isPending}
                  assignment={currentAssignment}
                  onAction={handleAction}
                />
              </div>
            </Card>
          </motion.div>
        </div>
        <div>
          <div className="m-5 flex justify-between">
            <Link href="/">
              <Button
                variant="ghost"
                className="rounded-full w-full outline outline-1 hover:bg-purple-600 hover:text-white transition-colors hover:outline-none"
              >
                Home Page
              </Button>
            </Link>
            <Link href="/assignment-personalization/my-assignments">
              <Button
                variant="ghost"
                className="rounded-full w-full outline outline-1 hover:bg-purple-600 hover:text-white transition-colors hover:outline-none"
              >
                My Assignments
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

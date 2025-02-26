"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatDistanceToNow } from "date-fns";
import { getAssignments } from "@/actions/get-assignments";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const [previousKeys, setPreviousKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const user = useCurrentUser();

  const handleViewResult = (run_id: string, personalization_id: string) => {
    sessionStorage.setItem("run_id", run_id);
    sessionStorage.setItem("personalization_id", personalization_id);
    sessionStorage.setItem("fromAllAssignments", "true"); // Set the flag
    router.push('/assignment-personalization/result');
  }


  const fetchAssignments = async (ExclusiveStartKey = null) => {
    if (!user?.id) return;

    setIsLoading(true);
    const { assignments: newAssignments, lastEvaluatedKey: newLastEvaluatedKey } = await getAssignments(user.id, 2, ExclusiveStartKey);

    setAssignments(newAssignments);
    setLastEvaluatedKey(newLastEvaluatedKey);
    setIsLoading(false);

  };

  useEffect(() => {
    fetchAssignments();
  }, [user]);

  const handleNextPage = () => {
    if (lastEvaluatedKey) {
      setPreviousKeys((prev) => [...prev, lastEvaluatedKey]); // Push current key to the stack
      fetchAssignments(lastEvaluatedKey); // Fetch next page
    }
  };

  const handlePreviousPage = () => {
    if (previousKeys.length > 0) {
      const previousKey = previousKeys[previousKeys.length - 1]; // Get the last key from the stack
      setPreviousKeys((prev) => prev.slice(0, -1)); // Remove the last key from the stack
      fetchAssignments(previousKey); // Fetch previous page
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="mb-5 p-1 text-3xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent md:text-4xl">
            Personalized Assignments [{assignments.length}]
          </h1>
          <p className="text-muted-foreground">View and manage your AI-personalized assignments</p>
        </div>
        <div className="space-y-6">
          {assignments && assignments.length > 0 ? (
            assignments.map((assignment) => {
              const uniqueKey = `RUN#${assignment.runId}#PERSONALIZATION#${assignment.personalizationId}`;

              return (
                <Card key={uniqueKey} className="hover:shadow-lg transition-all border-violet-100 dark:border-violet-800">
                  <div className="p-8 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-background relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">{assignment.title}</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                          Personalized {formatDistanceToNow(new Date(assignment.createdAt))} ago
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleViewResult(assignment.runId, assignment.personalizationId)} className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20 p-2 rounded-full transition">
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                      {assignment.text}
                    </p>
                  </div>
                </Card>
              );
            })
          ) : (
            (
              <Card className="p-12 text-center">
                <h3 className="text-xl font-semibold mb-2">No assignments yet</h3>
                <p className="text-muted-foreground mb-4">Your personalized assignments will appear here</p>
                <Link href="/assignment-personalization">
                  <Button size="lg" className="rounded-full w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-gray-1000 dark:text-white">
                    Create Your First Assignment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            )
          )}
        </div>
        <div className="flex justify-between mt-8">
          <Button
            onClick={handlePreviousPage}
            disabled={previousKeys.length === 0 || isLoading}
            className="rounded-full bg-violet-600 hover:bg-violet-700 text-gray-1000 dark:text-white"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={!lastEvaluatedKey || isLoading}
            className="rounded-full bg-violet-600 hover:bg-violet-700 text-gray-1000 dark:text-white"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

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
import { Toast } from "@/lib/utils/toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import "katex/dist/katex.min.css";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssignments } from "@/components/providers/assignments-provider";
export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [pageHistory, setPageHistory] = useState([]); // Stores past lastEvaluatedKeys for back navigation
  const [currentLastKey, setCurrentLastKey] = useState(null); // Last key for the current page
  const [loading, setLoading] = useState(false);
  const savedPageSize = sessionStorage.getItem("pageSize");
  const [pageSize, setPageSize] = useState(Number(savedPageSize) || 5); // Default page size

  const router = useRouter();
  const user = useCurrentUser();

  const handleViewResult = (run_id: string, personalization_id: string) => {
    sessionStorage.setItem("run_id", run_id);
    sessionStorage.setItem("personalization_id", personalization_id);
    sessionStorage.setItem("fromAllAssignments", "true"); // Set the flag
    router.push("/assignment-personalization/result");
  };
  const fetchAssignments = async (newLastKey = null, isNextPage = false) => {
    if (!user?.id || loading) return;

    setLoading(true);

    const { assignments: newAssignments, lastEvaluatedKey } =
      await getAssignments(user.id, newLastKey, pageSize);

    if (newAssignments.length === 0) {
      setCurrentLastKey(null);
    } else {
      setAssignments(newAssignments);
      setCurrentLastKey(lastEvaluatedKey);
    }

    if (isNextPage) {
      setPageHistory((prev) => [...prev, newLastKey]);
    } else if (newLastKey === null) {
      setPageHistory([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    const savedPageSize = sessionStorage.getItem("pageSize");
    if (savedPageSize) {
      setPageSize(Number(savedPageSize));
    }
    fetchAssignments();
  }, [user, pageSize]);

  const handleNext = () => {
    if (currentLastKey) {
      fetchAssignments(currentLastKey, true);
    }
  };

  const handlePrevious = () => {
    if (pageHistory.length > 1) {
      const previousPageKey = pageHistory[pageHistory.length - 2]; // Get the previous key
      setPageHistory((prev) => prev.slice(0, -1)); // Remove the current page from history
      fetchAssignments(previousPageKey, false);
    } else {
      fetchAssignments(null, false);
    }
  };

  const handlePageSizeChange = (value) => {
    const newSize = Number(value);
    setPageSize(newSize);
    sessionStorage.setItem("pageSize", newSize.toString());
    setPageHistory([]);
    setCurrentLastKey(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="mb-5 p-1 text-3xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent md:text-4xl">
            Personalized Assignments
          </h1>
          <p className="text-muted-foreground">
            View and manage your AI-personalized assignments
          </p>
        </div>
        <div className="space-y-6">
          {assignments && assignments.length > 0 ? (
            assignments.map((assignment) => {
              const uniqueKey = `RUN#${assignment.runId}#PERSONALIZATION#${assignment.personalizationId}`;
              const title = assignment.title;

              // Regular expression to match emojis
              const emojiRegex =
                /(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Emoji_Modifier_Base}|\p{Emoji})+/gu;

              // Extract emojis from the title
              const emojis = title.match(emojiRegex) || [];
              // Remove emojis from the title
              const titleWithoutEmojis = title.replace(emojiRegex, "").trim();

              return (
                <Card
                  key={uniqueKey}
                  className="hover:shadow-lg transition-all border-violet-100 dark:border-violet-800"
                >
                  <div className="p-8 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-background relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">
                          {titleWithoutEmojis}
                          <span style={{ fontFamily: "Noto Color Emoji" }}>
                            {emojis}
                          </span>
                        </h2>
                        <p className="text-sm text-muted-foreground mb-4">
                          Personalized{" "}
                          {formatDistanceToNow(new Date(assignment.createdAt))}{" "}
                          ago
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleViewResult(
                              assignment.runId,
                              assignment.personalizationId,
                            )
                          }
                          className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20 p-2 rounded-full transition"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeSanitize, rehypeKatex]}
                      className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3"
                    >
                      {assignment.text}
                    </ReactMarkdown>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="p-12 text-center">
              <h3 className="text-xl font-semibold mb-2">No assignments yet</h3>
              <p className="text-muted-foreground mb-4">
                Your personalized assignments will appear here
              </p>
              <Link href="/assignment-personalization">
                <Button
                  size="lg"
                  className="rounded-full w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-gray-1000 dark:text-white"
                >
                  Create Your First Assignment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          )}
        </div>
        <div className="flex justify-between items-center mt-6">
          {pageHistory.length !== 0 && (
            <Button
              onClick={handlePrevious}
              disabled={pageHistory.length === 0}
              className="bg-gray-500 hover:bg-gray-600"
            >
              <ChevronLeft className="h-5 w-5" /> Previous
            </Button>
          )}

          <div className="flex items-center gap-4">
            <Select
              onValueChange={handlePageSizeChange}
              value={pageSize.toString()}
            >
              <SelectTrigger className="w-24 bg-violet-600 hover:bg-violet-700">
                <SelectValue placeholder="Page Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {currentLastKey !== null && (
            <Button
              onClick={handleNext}
              disabled={currentLastKey === null}
              className="bg-violet-600 hover:bg-violet-700"
            >
              Next <ChevronRight className="h-5 w-5" />
            </Button>
          )}

        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight, ChevronLeft, ChevronRight, Eye, Trash } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatDistanceToNow } from "date-fns";
import { getAssignments } from "@/actions/get-assignments";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { generateUrlToken } from "@/actions/generate-url-token";
import { Toast } from "@/lib/utils/toast";

// --- Import shadcn/ui Dialog components ---
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const savedPageSize = sessionStorage.getItem("pageSize");
  const [pageSize, setPageSize] = useState(Number(savedPageSize) || 5); // Default page size

  // --- Delete confirmation state ---
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  const router = useRouter();
  const user = useCurrentUser();

  const handleViewResult = async (run_id: string) => {

    sessionStorage.setItem("fromAllAssignments", "true"); // Set the flag

    const data = await generateUrlToken(run_id);
    if (data.token) {
      router.push(`/assignment-personalization/result?token=${encodeURIComponent(data.token)}`);
    } else if (data.error) {
      Toast.error(data.error);
      router.push("/assignment-personalization/my-assignments");
      return;
    }
  };
  const fetchAssignments = async () => {
    if (!user?.id || loading) return;

    setLoading(true);

    const { assignments: newAssignments } = await getAssignments(user.id);

    setAssignments(newAssignments);
    setLoading(false);
  };

  useEffect(() => {
    document.title = "My Assignments";
  }, []);

  useEffect(() => {
    const savedPageSize = sessionStorage.getItem("pageSize");
    if (savedPageSize) {
      setPageSize(Number(savedPageSize));
    }
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pageSize]);

  const paginatedAssignments = assignments.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  )
  const handleNext = () => {
    if ((pageIndex + 1) * pageSize < assignments.length) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    setPageSize(newSize);
    sessionStorage.setItem("pageSize", newSize.toString());
    setPageIndex(0);
  };

  // --- Open the delete confirmation dialog ---
  const confirmDelete = (assignment: any) => {
    setAssignmentToDelete(assignment);
    setConfirmDeleteOpen(true);
  };

  // --- Handle the actual delete once user confirms ---
  const handleConfirmDelete = async () => {
    if (!assignmentToDelete) return;

    try {
      // Example: call an action to delete from DB
      // await deleteAssignment(assignmentToDelete.runId, assignmentToDelete.personalizationId);
      // Filter it out of local state to update UI:
      setAssignments((prev) =>
        prev.filter((a) => {
          const uniqueKeyA = `RUN#${a.runId}#PERSONALIZATION#${a.personalizationId}`;
          const uniqueKeyB = `RUN#${assignmentToDelete.runId}#PERSONALIZATION#${assignmentToDelete.personalizationId}`;
          return uniqueKeyA !== uniqueKeyB;
        })
      );
      Toast.success("Assignment deleted!");
    } catch (error: any) {
      Toast.error("Unable to delete assignment.");
    } finally {
      setConfirmDeleteOpen(false);
      setAssignmentToDelete(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="mb-5 p-1 text-3xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent md:text-4xl">
            My Personalized Assignments
          </h1>
          <p className="text-muted-foreground">
            View and manage your AI-personalized assignments
          </p>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center w-full h-24">
              <div className="animate-spin border-4 border-t-primary-500 border-opacity-50 h-12 w-12 text-primary-500" />
            </div>
          ) : paginatedAssignments && paginatedAssignments.length > 0 ? (
            paginatedAssignments.map((assignment) => {
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
                        {/* View button */}
                        <button
                          onClick={() =>
                            handleViewResult(
                              assignment.runId,
                            )
                          }
                          className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20 p-2 rounded-full transition"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {/* Delete button triggers confirmation */}
                        <button
                          onClick={() => confirmDelete(assignment)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition"
                        >
                          <Trash className="h-5 w-5" />
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
              <h3 className="text-xl font-semibold mb-2">No assignments personalized yet</h3>
              <br />
              <p className="text-muted-foreground mb-4">
                Your personalized assignments will appear here
              </p>
              <br />
              <Link href="/assignment-personalization">
                <Button
                  size="lg"
                  className="rounded-full w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-gray-1000 dark:text-white"
                >
                  Personalize Your First Assignment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          )}
        </div>
        <div className="flex items-center w-full mt-6">
        {/* Left section (Previous button) */}
        <div className="flex-1">
          {pageIndex !== 0 && (
            <Button
              onClick={handlePrevious}
              disabled={pageIndex === 0}
              className="bg-gray-500 hover:bg-gray-600 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" /> Previous
            </Button>
          )}
        </div>
        {/* Middle section (Select) */}
        <div className="flex-1 flex justify-center">
            <Select
              onValueChange={handlePageSizeChange}
              value={pageSize.toString()}
            >
              <SelectTrigger className="w-24 bg-violet-600 hover:bg-violet-700 text-white">
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
          {/* Right section (Next button) */}
          <div className="flex-1 flex justify-end">
          {!((pageIndex + 1) * pageSize >= assignments.length) && (
            <Button
              onClick={handleNext}
              disabled={(pageIndex + 1) * pageSize >= assignments.length}
              className="bg-violet-600 hover:bg-violet-700 rounded-full"
            >
              Next <ChevronRight className="h-5 w-5" />
            </Button>
          )}
          </div>
        </div>
      </div>

      {/* ------------------------------- */}
      {/* Delete Confirmation Dialog */}
      {/* ------------------------------- */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Assignment</DialogTitle>
            <hr />
            <br />
            <DialogDescription>
            <b>Are you sure you want to delete this assignment? </b>
            <br /> <br />
            This action will permanently remove the assignment,
            including its simplifications and re-personalization attempts.
            <br /> <br />
            <span className="text-red-500">
              This action cannot be undone.
            </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

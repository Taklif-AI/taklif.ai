"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Assignment } from "@/lib/types/assigment-type";
import { Toast } from "@/lib/utils/toast";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, ThumbsDown, RefreshCw, Wand2 } from "lucide-react";


export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    // Simulated assignments data - in a real app, this would come from an API
    const mockAssignments: Assignment[] = [
      {
        id: "1",
        title: "Introduction to Physics",
        text: "Create a comprehensive explanation of Newton's laws of motion with practical examples from everyday life. Include mathematical formulas and their applications.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        dislikes: 1
      },
      {
        id: "2",
        title: "Advanced Mathematics",
        text: "Develop a step-by-step guide to solving quadratic equations, including the quadratic formula, completing the square, and factoring methods.",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        dislikes: 0
      }
    ];
    setAssignments(mockAssignments);
  }, []);

  const handleLike = (id: string) => {
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === id
          ? { ...assignment, likes: assignment.likes + 1 }
          : assignment
      )
    );
    Toast.success("Assignment liked!");
  };

  const handleDislike = (id: string) => {
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === id
          ? { ...assignment, dislikes: assignment.dislikes + 1 }
          : assignment
      )
    );
    Toast.success("Feedback recorded");
  };

  const handleRegenerate = (id: string) => {
    Toast.success("Regenerating assignment...");
    // In a real app, this would trigger the regeneration process
  };

  const handleSimplify = (id: string) => {
    Toast.success("Simplifying assignment...");
    // In a real app, this would trigger the simplification process
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Personalized Assignments</h1>
          <p className="text-muted-foreground">
            View and manage your AI-personalized assignments
          </p>
        </div>

        <div className="space-y-6">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="p-6 hover:shadow-lg transition-all">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">{assignment.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      Personalized {formatDistanceToNow(new Date(assignment.createdAt))} ago
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSimplify(assignment.id)}
                      className="text-violet-600 hover:text-violet-700"
                    >
                      <Wand2 className="h-4 w-4 mr-1" />
                      Simplify
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRegenerate(assignment.id)}
                      className="text-violet-600 hover:text-violet-700"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Re-personaliz
                    </Button>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {assignment.text}
                </p>

                <div className="flex items-center gap-4 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(assignment.id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDislike(assignment.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {assignments.length === 0 && (
            <Card className="p-12 text-center">
              <h3 className="text-xl font-semibold mb-2">No assignments yet</h3>
              <p className="text-muted-foreground mb-4">
                Your personalized assignments will appear here
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
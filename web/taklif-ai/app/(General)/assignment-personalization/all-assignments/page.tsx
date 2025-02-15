"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatDistanceToNow } from "date-fns";
import { getAssignments } from "@/lib/database/get-assignments";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  
  const user = useCurrentUser();

  useEffect(() => {
    async function fetchAssignments() {
      if (!user?.id)
        return;
  
      const data = await getAssignments(user.id);

      if (!data) {
        console.warn("⚠️ No assignments returned from API.");
        setAssignments([]); // Ensure empty array if no assignments
        return;
      }

      setAssignments(data); 
    }
  
    fetchAssignments();
  }, [user]);
  
  
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
                        <Link href={'TODO'} className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20 p-2 rounded-full transition">
                          <Eye className="h-5 w-5" />
                        </Link>
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
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}

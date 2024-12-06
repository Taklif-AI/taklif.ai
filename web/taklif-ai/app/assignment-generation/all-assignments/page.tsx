"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { File, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { AssignmentDetails } from "@/components/assignment/additional-components/assignment-details";

interface Assignment {
  id: string;
  title: string;
  fileName: string;
  createdAt: string;
  difficulty: string;
  interest: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    // Load assignments from localStorage
    const savedAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    setAssignments(savedAssignments);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      hard: "bg-red-100 text-red-800",
    };
    return colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handleViewDetails = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsDetailsOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Assignments</h1>
        <Link href="/assignment-generation">
          <Button>Create New Assignment</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <File className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">{assignment.title}</h2>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Created on {new Date(assignment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getDifficultyColor(assignment.difficulty)}>
                      {assignment.difficulty.charAt(0).toUpperCase() + assignment.difficulty.slice(1)}
                    </Badge>

                    <Badge variant="outline" className="flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {assignment.interest}
                    </Badge>

                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => handleViewDetails(assignment)}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {assignments.length === 0 && (
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">No assignments yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first assignment to get started
          </p>
          <Link href="/assignment">
            <Button>Create New Assignment</Button>
          </Link>
        </Card>
      )}

      <AssignmentDetails
        assignment={selectedAssignment}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
}
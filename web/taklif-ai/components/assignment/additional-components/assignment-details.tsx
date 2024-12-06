"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { File, Clock, Tag, Brain } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Assignment {
  id: string;
  title: string;
  fileName: string;
  createdAt: string;
  difficulty: string;
  interest: string;
}

interface AssignmentDetailsProps {
  assignment: Assignment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignmentDetails({ assignment, open, onOpenChange }: AssignmentDetailsProps) {
  if (!assignment) return null;

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      hard: "bg-red-100 text-red-800",
    };
    return colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assignment Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="space-y-6 py-4">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <File className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{assignment.title}</h2>
                  <p className="text-sm text-muted-foreground">{assignment.fileName}</p>
                </div>
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>Created on {new Date(assignment.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  <span className="font-medium">Difficulty Level</span>
                </div>
                <Badge className={getDifficultyColor(assignment.difficulty)}>
                  {assignment.difficulty.charAt(0).toUpperCase() + assignment.difficulty.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  <span className="font-medium">Interest</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  
                    <Badge variant="outline">
                      {assignment.interest}
                    </Badge>
                  
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
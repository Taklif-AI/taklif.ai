"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";

interface ReviewStepProps {
  data: {
    file: File | null;
    difficulty: string;
    wordCount: number;
    interest: string;
  };
  onBack: () => void;
  onSubmit: () => void;
}

export function ReviewStep({ data, onBack, onSubmit }: ReviewStepProps) {
  
  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      easy: 'Basic',
      medium: 'Intermediate',
      hard: 'Advanced',
    };
    return labels[difficulty as keyof typeof labels] || difficulty;
  };

  return (
    <Card className="p-8 max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Review Your Assignment Setup</h1>
        <p className="text-muted-foreground">
          Please review your selections before generating the assignment
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-secondary/50 rounded-lg">
          <h2 className="font-semibold mb-2">Selected PDF</h2>
          <div className="text-sm">
            <p className="mb-1">{data.file?.name}</p>
            <p className="text-muted-foreground">
              Size: {data.file ? (data.file.size / (1024 * 1024)).toFixed(2) + ' MB' : ''}
            </p>
          </div>
        </div>

        <div className="p-4 bg-secondary/50 rounded-lg">
          <h2 className="font-semibold mb-2">Assignment Settings</h2>
          <div className="space-y-2 text-sm">
            <p>Difficulty Level: <span className="font-medium">{getDifficultyLabel(data.difficulty)}</span></p>
            <p>Word Count: <span className="font-medium">{data.wordCount} words</span></p>
          </div>
        </div>

        <div className="p-4 bg-secondary/50 rounded-lg">
          <h2 className="font-semibold mb-2">Selected Topics</h2>
          <div className="flex flex-wrap gap-2">
            <span
              className="px-2 py-1 bg-primary/10 rounded-md text-sm"
            >
              {data.interest}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Edit
        </Button>
        <Button onClick={onSubmit}>
          Generate Assignment
          <Send className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
}
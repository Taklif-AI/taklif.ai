"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Zap, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateDifficulty } from "@/lib/validators/assignment-validator";
import { Toast } from "@/lib/utils/toast";

interface DifficultyOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface DifficultySelectProps {
  onNext: (data: { difficulty: string; wordCount: number }) => void;
  onBack: () => void;
  initialDifficulty?: string;
}

const difficulties: DifficultyOption[] = [
  {
    id: "easy",
    title: "Basic",
    description: "Simple questions to test fundamental understanding",
    icon: <Brain className="h-6 w-6" />,
  },
  {
    id: "medium",
    title: "Intermediate",
    description: "Balanced mix of concept application questions",
    icon: <Target className="h-6 w-6" />,
  },
  {
    id: "hard",
    title: "Advanced",
    description: "Complex questions requiring deep analysis",
    icon: <Zap className="h-6 w-6" />,
  },
];

export function DifficultySelect({ onNext, onBack, initialDifficulty }: DifficultySelectProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(initialDifficulty || "easy");
  const [wordCount, setWordCount] = useState<number>(400);

  const handleNext = () => {
    const difficultyValidator = validateDifficulty(selectedDifficulty, wordCount);
    if (!difficultyValidator.isValid) {
      Toast.error(difficultyValidator.error || "Invalid difficulty or word count");
      return;
    }
    onNext({
      difficulty: selectedDifficulty,
      wordCount: wordCount
    });
  };

  return (
    <Card className="p-8 max-w-xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Select Difficulty Level</h2>
        <p className="text-muted-foreground">
          Choose how challenging you want the questions to be
        </p>
      </div>

      <div className="grid gap-4 mb-6">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.id}
            onClick={() => setSelectedDifficulty(difficulty.id)}
            className={`flex items-center p-4 border rounded-lg transition-colors ${selectedDifficulty === difficulty.id
              ? "border-primary bg-primary/5"
              : "hover:border-primary hover:bg-primary/5"
              }`}
          >
            <div className="mr-4 text-primary">{difficulty.icon}</div>
            <div className="text-left">
              <h3 className="font-medium">{difficulty.title}</h3>
              <p className="text-sm text-muted-foreground">
                {difficulty.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-2 mb-6">
        <Label htmlFor="wordCount">Assignment Word Count</Label>
        <Input
          id="wordCount"
          type="number"
          min={100}
          max={2000}
          value={wordCount}
          onChange={(e) => setWordCount(Number(e.target.value))}
          className="bg-violet-50/50 dark:bg-violet-950/20"
        />
        <p className="text-sm text-muted-foreground">
          Recommended: 400 words for a balanced assignment
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="bg-violet-600 hover:bg-violet-700"
        >
          Continue
        </Button>
      </div>
    </Card>
  );
}
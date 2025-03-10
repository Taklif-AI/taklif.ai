"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SportsBasketballOutlined } from '@mui/icons-material';
import {
  Book,
  Sparkles,
  Earth,
  Cpu,
  CodeXml,
  SquareSigma,
  Dices,
  Rocket,
  Palette,
  BookText,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import assignmentsData from "@/data/assignments.json";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import "katex/dist/katex.min.css";

const assignmentIcons: Record<number, any> = {
  1: CodeXml,
  2: SquareSigma,
  3: Dices,
};

const interestIcons: Record<string, any> = {
  Basketball: SportsBasketballOutlined,
  Astronomy: Rocket,
  Painting: Palette,
  Poetry: BookText,
};

export function HomeMagic() {
  const [currentStep, setCurrentStep] = useState(1);

  const [selectedAssignment, setSelectedAssignment] = useState(
    assignmentsData.assignments[0]
  );

  const SelectedAssignmentIcon = assignmentIcons[selectedAssignment.id] || CodeXml;

  const [selectedInterest, setSelectedInterest] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState("");
  const [displayedResult, setDisplayedResult] = useState("");

  const steps = [
    {
      title: "Step 1: Choose an Assignment",
      description: "Pick one of the assignments from the JSON data below.",
      icon: Book,
    },
    {
      title: "Step 2: Choose an Interest",
      description: "Select an interest related to that assignment.",
      icon: Earth,
    },
    {
      title: "Step 3: Generate",
      description: "Watch the AI tailor the assignment for you.",
      icon: Sparkles,
    },
  ];

  const handleNext = () => {
    if (currentStep === 3) {
      setCurrentStep(1);
      setSelectedAssignment(assignmentsData.assignments[0]);
      setSelectedInterest("");
      setGeneratedResult("");
      setDisplayedResult("");
      setIsGenerating(false);
      return;
    }

    if (
      (currentStep === 1 && selectedAssignment) ||
      (currentStep === 2 && selectedInterest)
    ) {
      if (currentStep === 2) {
        simulateGeneration();
      }
      setCurrentStep((prev) => prev + 1);
    }

  };

  const simulateGeneration = () => {
    setIsGenerating(true);

    const assignmentTitle = selectedAssignment.title;
    const interestTitle =
      selectedAssignment.interests[selectedInterest]?.title || selectedInterest;
    const interestContent =
      selectedAssignment.interests[selectedInterest]?.content || "";

    const result = `### ${interestTitle}\n\n${interestContent}`;

    // Simulate a small delay  
    setTimeout(() => {
      setGeneratedResult(result);
      setIsGenerating(false);
    }, 100);

  };

  // Animate the "typing" effect
  useEffect(() => {
    if (generatedResult && !isGenerating) {
      let index = 0;
      let typed = "";
      const interval = setInterval(() => {
        if (index < generatedResult.length) {
          typed += generatedResult[index];
          index++;
          setDisplayedResult(typed);
        } else {
          clearInterval(interval);
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [generatedResult, isGenerating]);

  // Current step's icon
  const CurrentIcon = steps[currentStep - 1].icon;

  return (
    <div id="magic" className="container mx-auto p-4 sm:p-6">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 sm:mb-16 text-center"
      >
        <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
          How It Works
        </h2>
        <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Three simple steps to transform your learning experience with
          AI-powered assignments.
        </p>
      </motion.div>

      {/* Main Card / Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 sm:mb-16"
      >
        <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto bg-card rounded-lg overflow-hidden shadow-xl border">
          {/* Left Panel: Step Info */}
          <div className="w-full lg:w-1/3 bg-gradient-to-br from-violet-600 to-purple-700 p-6 sm:p-8 flex flex-col justify-between text-center lg:text-left">
            <div className=" sticky top-0 h-max">
              {/* Step Title & Icon */}
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {steps[currentStep - 1].title}
                </h2>
                <CurrentIcon className="w-8 h-8 text-white" />
              </div>

              {/* Step Description */}
              <p className="text-sm sm:text-base text-white/80 mt-4">
                {steps[currentStep - 1].description}
              </p>

              {/* Step Indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${step === currentStep ? "bg-white w-4" : "bg-white/50"
                      }`}
                  />
                ))}
              </div>

              {/* Next or Restart Button */}
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedAssignment) ||
                  (currentStep === 2 && !selectedInterest)
                }
                className="bg-white text-purple-600 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto mt-2"
              >
                {currentStep === 3 ? "Start Over" : "Next"}
              </Button>
            </div>
          </div>

          {/* Right Panel: Content */}
          <div className="lg:w-2/3 p-6 sm:p-8">
            {/* STEP 1: Choose Assignment */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {assignmentsData.assignments.map((assignment) => {
                  const Icon =
                    assignmentIcons[assignment.id] || assignmentIcons[1];
                  const isSelected = assignment.id === selectedAssignment.id;

                  return (
                    <Card
                      key={assignment.id}
                      onClick={() => setSelectedAssignment(assignment)}
                      className={`p-4 hover:bg-accent cursor-pointer transition-all hover:scale-[1.02] flex items-start space-x-4 ${isSelected ? "ring-2 ring-purple-500" : ""
                        }`}
                    >
                      <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                        <Icon className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{assignment.title}</h3>
                        {isSelected && (
                        <div className="prose dark:prose-invert max-w-none text-sm text-muted-foreground mt-2 leading-tight">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeSanitize, rehypeKatex]}
                          >
                            {assignment.content}
                          </ReactMarkdown>
                        </div>
                      )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* STEP 2: Choose Interest */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Get the interest keys from the selected assignment */}
                {Object.keys(selectedAssignment.interests).map((interestKey) => {
                  const Icon =
                    interestIcons[interestKey] || interestIcons["Basketball"];
                  const isSelected = selectedInterest === interestKey;

                  return (
                    <Card
                      key={interestKey}
                      onClick={() => setSelectedInterest(interestKey)}
                      className={`p-4 sm:p-6 hover:bg-accent cursor-pointer transition-all hover:scale-[1.02] flex flex-col items-center justify-center space-y-3 ${isSelected ? "ring-2 ring-purple-500" : ""
                        }`}
                    >
                      <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                        <Icon className="h-6 w-6 text-purple-500" />
                      </div>
                      <p className="font-medium text-sm sm:text-base">
                        {interestKey}
                      </p>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* STEP 3: Generate / Display Generated Content */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <Card className="p-4 sm:p-6 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                      <SelectedAssignmentIcon className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">
                        Selected Assignment:
                      </p>
                      <p className="text-muted-foreground">
                        {selectedAssignment.title}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 sm:p-6">
                  {isGenerating ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin">
                        <Cpu className="h-5 w-5 text-purple-500" />
                      </div>
                      <p>AI is generating your personalized assignment...</p>
                    </div>
                  ) : (
                    <div className="
                    prose 
                    dark:prose-invert 
                    max-w-none
                    font-sans
                  ">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeSanitize, rehypeKatex]}
                        >
                          {displayedResult}
                        </ReactMarkdown>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>

  );
}
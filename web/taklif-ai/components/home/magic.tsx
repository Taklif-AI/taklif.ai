"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Book,
  Sparkles,
  BookOpen,
  Cpu,
  Zap,
  Network,
  Workflow,
  Binary,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import assignmentsData from '@/data/assignments.json';

export function HomeMagic() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInterest, setSelectedInterest] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState("");
  const [displayedResult, setDisplayedResult] = useState("");

  const steps = [
    {
      title: "Step 1: Enter Your Assignment",
      description: "Select one of the predefined assignments to get started.",
      icon: Book,
    },
    {
      title: "Step 2: Choose Your Interest",
      description: "Select one of the interest options below.",
      icon: Sparkles,
    },
    {
      title: "Step 3: Generate",
      description: "Your assignment result is being generated.",
      icon: BookOpen,
    },
  ];

  // Use the data from the JSON file
  //const assignments = assignmentsData.assignments;

  const assignments = [
    {
      title: "Write an essay on climate change",
      details:
        "Discuss the causes, effects, and potential solutions to climate change.",
      icon: Workflow,
      keyTopics: [
        "Greenhouse gas emissions",
        "Global warming",
        "Renewable energy solutions",
        "Carbon footprint reduction",
      ],
      examples: [
        "Case study: Impact of deforestation in the Amazon",
        "Example: Transition to solar energy in Germany",
      ],
      resources: [
        "IPCC Climate Reports",
        "NASA Climate Change Website",
        "UN Sustainable Development Goals",
      ],
    },
    {
      title: "Create a presentation on renewable energy",
      details:
        "Highlight different types of renewable energy sources and their benefits.",
      icon: Zap,
      keyTopics: [
        "Solar energy",
        "Wind energy",
        "Hydropower",
        "Geothermal energy",
      ],
      examples: [
        "Example: Solar farms in California",
        "Case study: Wind energy in Denmark",
      ],
      resources: [
        "International Renewable Energy Agency (IRENA)",
        "U.S. Department of Energy",
        "Renewable Energy World",
      ],
    },
    {
      title: "Develop a project on sustainable living",
      details:
        "Propose a plan for a sustainable living community, including energy, water, and waste management.",
      icon: Network,
      keyTopics: [
        "Zero-waste lifestyle",
        "Sustainable architecture",
        "Community gardens",
        "Water conservation techniques",
      ],
      examples: [
        "Example: Eco-villages in Scandinavia",
        "Case study: Sustainable urban planning in Singapore",
      ],
      resources: [
        "World Green Building Council",
        "Sustainable Living Foundation",
        "UN Environment Programme",
      ],
    },
  ];

  const [selectedAssignment, setSelectedAssignment] = useState(
    assignments[0].title,
  );

  // const interests = [
  //   { name: "Basketball", icon: Workflow },
  //   { name: "Astronomy", icon: Zap },
  //   { name: "Painting", icon: Binary },
  //   { name: "Poetry", icon: Network },
  // ];

  const interests = [
    { name: "Environmental Science", icon: Workflow },
    { name: "Renewable Energy", icon: Zap },
    { name: "Climate Policy", icon: Binary },
    { name: "Sustainable Living", icon: Network },
    { name: "Green Technology", icon: Cpu },
  ];

  const handleNext = () => {
    if (currentStep === 3) {
      setCurrentStep(1);
      setSelectedAssignment(assignments[0].title);
      setSelectedInterest("");
      setGeneratedResult("");
      setDisplayedResult("");
      setIsGenerating(false);
    } else if (
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
    const result = `Based on your selection of "${selectedAssignment}" and interest in "${selectedInterest}", here's your personalized assignment structure:

1. Introduction
   - Background on the topic
   - Current relevance
   - Thesis statement

2. Main Body
   - Key concepts and definitions
   - Analysis of current trends
   - Supporting evidence and data
   - Expert opinions and research

3. Recommendations
   - Practical solutions
   - Implementation strategies
   - Future implications

4. Conclusion
   - Summary of key points
   - Call to action
   - Future research directions`;

    setGeneratedResult(result);
    setIsGenerating(false);
  };

  useEffect(() => {
    if (generatedResult && !isGenerating) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < generatedResult.length) {
          setDisplayedResult((prev) => prev + generatedResult[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 20);
    }
  }, [generatedResult, isGenerating]);

  const CurrentIcon = steps[currentStep - 1].icon;

  return (
    <div id="magic" className="container mx-auto p-4 sm:p-6">
      <div>
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
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 sm:mb-16"
      >
        <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto bg-card rounded-lg overflow-hidden shadow-xl border">
          {/* Left Panel */}
          <div className="w-full lg:w-1/3 bg-gradient-to-br from-violet-600 to-purple-700 p-6 sm:p-8 flex flex-col justify-between text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {steps[currentStep - 1].title}
              </h2>
              <CurrentIcon className="w-8 h-8 text-white" />
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-white/80 mt-4">
              {steps[currentStep - 1].description}
            </p>

            <div className="flex justify-center mt-8 space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${step === currentStep ? "bg-white w-4" : "bg-white/50"
                    }`}
                />
              ))}
            </div>
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

          {/* Right Panel */}
          <div className="lg:w-2/3 p-6 sm:p-8">
            {currentStep === 1 && (
              <div className="space-y-4">
                {assignments.map((assignment, index) => {
                  const Icon = assignment.icon;
                  const isSelected = selectedAssignment === assignment.title;

                  return (
                    <Card
                      key={index}
                      className={`p-4 hover:bg-accent cursor-pointer transition-all hover:scale-[1.02] flex items-start space-x-4 ${isSelected ? "ring-2 ring-purple-500" : ""
                        }`}
                      onClick={() => setSelectedAssignment(assignment.title)}
                    >
                      <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                        <Icon className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{assignment.title}</h3>
                        {isSelected && (
                          <div className="mt-2 space-y-2">
                            <p className="text-sm text-muted-foreground">
                              {assignment.details}
                            </p>
                            <div className="text-sm text-muted-foreground">
                              <h4 className="font-medium">Key Topics:</h4>
                              <ul className="list-disc list-inside">
                                {assignment.keyTopics?.map((topic, i) => (
                                  <li key={i}>{topic}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <h4 className="font-medium">Examples:</h4>
                              <ul className="list-disc list-inside">
                                {assignment.examples?.map((example, i) => (
                                  <li key={i}>{example}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <h4 className="font-medium">Resources:</h4>
                              <ul className="list-disc list-inside">
                                {assignment.resources?.map((resource, i) => (
                                  <li key={i}>{resource}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interests.map((interest, index) => {
                  const Icon = interest.icon;
                  return (
                    <Card
                      key={index}
                      className={`p-4 sm:p-6 hover:bg-accent cursor-pointer transition-all hover:scale-[1.02] flex flex-col items-center justify-center space-y-3 ${selectedInterest === interest.name
                        ? "ring-2 ring-purple-500"
                        : ""
                        }`}
                      onClick={() => setSelectedInterest(interest.name)}
                    >
                      <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                        <Icon className="h-6 w-6 text-purple-500" />
                      </div>
                      <p className="font-medium text-sm sm:text-base">
                        {interest.name}
                      </p>
                    </Card>
                  );
                })}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <Card className="p-4 sm:p-6 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                      <Binary className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">
                        Selected Assignment:
                      </p>
                      <p className="text-muted-foreground">
                        {selectedAssignment}
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
                    <div className="prose dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans">
                        {displayedResult}
                      </pre>
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

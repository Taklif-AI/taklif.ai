"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { validateInterest } from "@/lib/validators/assignment-validator";
import { Toast } from "@/lib/utils/toast";
import Image from "next/image";
import SVGIMG from "../../../public/white.png";
interface InterestsSelectProps {
  onNext: (interest: string) => void;
  onBack: () => void;
  initialInterests: string;
}

const suggestedInterests = [
  "Mathematics",
  "Physics",
  "Computer Science",
  "Biology",
  "Chemistry",
  "History",
  "Literature",
  "Art",
  "Music",
  "Psychology",
];


export function InterestsSelect({ onNext, onBack, initialInterests }: InterestsSelectProps) {
  const [selectedInterest, setSelectedInterest] = useState<string>("");
  const [customInterest, setCustomInterest] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (initialInterests) {
      setSelectedInterest(initialInterests);
      if (!suggestedInterests.includes(initialInterests)) {
        setCustomInterest(initialInterests);
        setIsCustom(true);
      }
    }
  }, [initialInterests]);


  const handleSuggestedInterestClick = (interest: string) => {
    setSelectedInterest(interest);
    setCustomInterest("");
    setIsCustom(false);
  };

  const handleCustomInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomInterest(value);
    setSelectedInterest(value);
    setIsCustom(true);
  };

  const handleNext = () => {
    const interestToSubmit = isCustom ? customInterest : selectedInterest;

    // validation step
    const interestValidator = validateInterest(interestToSubmit);
    if (!interestValidator.isValid) {
      Toast.error(interestValidator.error || "Invalid Interest");
      return;
    }

    onNext(interestToSubmit);
  };

  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 w-fit -z-10 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-950/20 dark:to-background" />

      </div>

      <Card className="min-h-[574.18px] p-8 max-w-xl mx-auto backdrop-blur-sm bg-white/80 dark:bg-gray-950/80">

        <div className="overflow-auto h-20 ;">

          <Image className=" absolute   translate-y-[-1.9rem] translate-x-[-2rem] opacity-[0.04]	 -z-10  " src={SVGIMG} alt={""} />
        </div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Select Your Interest</h2>
          <p className="text-muted-foreground">
            Choose a topic you are interested in
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Suggested Interests</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedInterests.map((interest) => (
                <Badge
                  key={interest}
                  variant={selectedInterest === interest && !isCustom ? "default" : "outline"}
                  className={`cursor-pointer hover:bg-primary hover:text-primary-foreground ${selectedInterest === interest && !isCustom
                    ? "bg-violet-600 text-white"
                    : "hover:bg-violet-500 dark:hover:bg-violet-200"
                    }`}
                  onClick={() => handleSuggestedInterestClick(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Or Enter Custom Interest</h3>
            <Input
              value={customInterest}
              onChange={handleCustomInterestChange}
              placeholder="Enter your interest"
              className={`bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm ${isCustom ? "border-violet-500 ring-1 ring-violet-500" : ""
                }`}
            />
          </div>

          {selectedInterest && (
            <div className="p-4 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm rounded-lg border border-violet-100 dark:border-violet-900/20">
              <p className="text-sm font-medium">Selected Interest:</p>
              <p className="text-violet-600 dark:text-violet-400 font-semibold mt-1">
                {selectedInterest}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <Button className="rounded-full" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!selectedInterest.trim()}
            className="rounded-full"
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
}
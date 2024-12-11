"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PDFUpload } from "../../components/assignment/assignment-generation-steps/pdf-upload";
import { InterestsSelect } from "../../components/assignment/assignment-generation-steps/interests-select";
import { ReviewStep } from "@/components/assignment/assignment-generation-steps/review-step";
import { ProgressSteps } from "@/components/ui/progress-steps";
import { storage } from "@/lib/utils/local-storage";
import { Toast } from "@/lib/utils/toast";

const steps = ["Upload PDF", "Choose Interests", "Review Inputs"];

export default function AssignmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [assignmentData, setAssignmentData] = useState({
    file: null as File | null,
    difficulty: "easy",
    wordCount: 400,
    interest: "",
  });

  useEffect(() => {
    // Load saved progress
    const savedFile = storage.getProgress('PDF_FILE');
    const savedInterests = storage.getProgress('INTERESTS');
    const savedStep = storage.getProgress('CURRENT_STEP');

    if (savedFile || savedInterests) {
      setAssignmentData({
        file: savedFile,
        difficulty: "easy",
        wordCount: 400,
        interest: savedInterests || "",
      });
    }

    if (savedStep !== null) {
      setCurrentStep(Number(savedStep));
    }
  }, [assignmentData]);


  const handleNext = (stepData: any) => {
    try {
      const updatedData = { ...assignmentData, ...stepData };
      setAssignmentData(updatedData);

      if (currentStep === 0) {
        storage.saveProgress('PDF_FILE', stepData.file);
      } else if (currentStep === 1) {
        storage.saveProgress('INTERESTS', stepData.interests);
      }

      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      storage.saveProgress('CURRENT_STEP', nextStep);
    } catch (error) {
      Toast.error("An error occurred while saving progress");
    }
  };


 

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      storage.saveProgress('CURRENT_STEP', prevStep);
    }
  };
  const handleSubmit = async () => {
    try {
      const fileName = assignmentData.file?.name || 'Untitled';
      const title = fileName.replace(/\.pdf$/i, '');

      // prepere the data to be sent to the backend
      const dataToApi = {
        model: "openrouter/google/learnlm-1.5-pro-experimental:free",
        params: {
          student_interest: assignmentData.interest,
          general_assignment: "A permutation is simply a name for a reordering. So the permutations of the string ‘abc’ are ‘abc’, ‘acb’, ‘bac’, ‘bca’, ‘cab’, and ‘cba’. Note that a sequence is a permutation of itself (the trivial permutation). For this part of the pset you’ll need to write a recursive function get_permutations that takes a string and returns a list of all its permutations. You will find this function helpful later in the pset for part C. A couple of notes on the requirements: Recursion MUST be used, global variables may NOT be used. Additionally, it is okay to use loops to code the solution. The order of the returned permutations does not matter. Please also avoid returning duplicates in your final list.",
         
        }
      };

      // send the assignment to the backend
      const res = await fetch('/api/assignment-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToApi)
      });

      // check the incoming response
      // if (!res.ok) {
      //   Toast.error("Failed to create assignment. Please try again.");
      //   return;
      // }

      // const result = await res.json();
      // // check the parsed result
      // if (!result || result.error) {
      //   Toast.error(result.error);
      //   return;
      // }
      // console.log(result);

      const newAssignment = {
        id: Date.now().toString(),
        title,
        fileName: fileName || 'unknown.pdf',
        createdAt: new Date().toISOString(),
        wordCount: assignmentData.wordCount,
        interest: assignmentData.interest,
      };
      const existingAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
      localStorage.setItem('assignments', JSON.stringify([...existingAssignments, newAssignment]));

      storage.clearProgress();
      Toast.success("Assignment created successfully!");
      router.push('/assignment-generation/all-assignments');
      /* eslint-disable */
    } catch (error) {
      Toast.error("Failed to create assignment. Please try again.");
    }
    /* eslint-enable */
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PDFUpload 
            onNext={(file) => handleNext({ file })} 
            initialFile={assignmentData.file}
          />
        );
      case 1:
        return (
          <InterestsSelect
            onNext={(interests) => handleNext({ interests })}
            onBack={handleBack}
            initialInterests={assignmentData.interest}
                      />
        );
      case 2:
        return (
          <ReviewStep
            data={assignmentData}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 rounded-lg shadow-sm">
          <ProgressSteps currentStep={currentStep} steps={steps} />
        </div>
        <div className="mt-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
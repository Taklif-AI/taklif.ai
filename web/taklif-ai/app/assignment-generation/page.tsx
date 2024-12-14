"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PDFUpload } from "../../components/assignment/assignment-generation-steps/pdf-upload";
import { InterestsSelect } from "../../components/assignment/assignment-generation-steps/interests-select";
import { ReviewStep } from "@/components/assignment/assignment-generation-steps/review-step";
import { ProgressSteps } from "@/components/ui/progress-steps";
import { storage } from "@/lib/utils/local-storage";
import { Toast } from "@/lib/utils/toast";
import { fileToBase64 } from "@/lib/utils/file-to-base64";

const steps = ["Upload PDF", "Choose Interests", "Review Inputs"];

export default function AssignmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [assignmentData, setAssignmentData] = useState({
    file: null as File | "" | null,
    // difficulty: "easy",
    // wordCount: 400,
    interest: "",
  });

  useEffect(() => {
    const savedFile = storage.getProgress('PDF_FILE');
    const savedInterests = storage.getProgress('INTERESTS');
    const savedStep = storage.getProgress('CURRENT_STEP');

    if (savedFile || savedInterests) {
      setAssignmentData(prev => ({
        ...prev,
        file: savedFile,
        difficulty: "easy",
        wordCount: 400,
        interest: savedInterests,
      }));
    }

    if (savedStep !== null) {
      setCurrentStep(Number(savedStep));
    }
  }, []);



  const handleNext = (stepData: any) => {
    try {
      const updatedData = { ...assignmentData, ...stepData };
      setAssignmentData(updatedData);

      if (currentStep === 0) {
        storage.saveProgress('PDF_FILE', stepData.file);
      } else if (currentStep === 1) {
        storage.saveProgress('INTERESTS', stepData.interest);
      }

      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      storage.saveProgress('CURRENT_STEP', nextStep);
    } catch (error) {
      console.log(error);
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
    let fileName = '';
    let title = '';
    const sleep = (ms: number): Promise<void> => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
    router.push('assignment-generation/loading/');
    await sleep(10000);



    // prepare the assignment-data to the backend
    const dataToBackend = {
      student_interest: assignmentData.interest,
      general_assignment: "",
      is_pdf: false,
    }

    try {
      if (assignmentData.file instanceof File) {
        fileName = assignmentData.file?.name || 'Untitled';
        title = fileName.replace(/\.pdf$/i, '');
        try {
          const base64 = await fileToBase64(assignmentData.file);
          dataToBackend.general_assignment = base64;
          dataToBackend.is_pdf = true;
        } catch (error) {
          console.log(error);
          Toast.error("Failed to process your file. Please try again.");
        }
      } else if (typeof assignmentData.file === 'string') {
        fileName = assignmentData.file;
        title = 'Text-based assignment';
        dataToBackend.general_assignment = assignmentData.file;
        dataToBackend.is_pdf = false;
      }


      // send the assignment to the backend
      const res = await fetch('/api/assignment-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToBackend)

      });

      // check the incoming response
      if (!res.ok) {
        Toast.error("Failed to create assignment. Please try again.1");
        return;
      }

      const result = await res.json();
      // check the parsed result
      if (!result || result.error) {
        Toast.error(result.error);
        return;
      }
      console.log(result);

      const newAssignment = {
        id: Date.now().toString(),
        title,
        fileName: fileName || 'unknown.pdf',
        createdAt: new Date().toISOString(),
        interest: assignmentData.interest,
      };
      const existingAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
      localStorage.setItem('assignments', JSON.stringify([...existingAssignments, newAssignment]));

      storage.clearProgress();
      Toast.success("Assignment created successfully!");
      router.push('/assignment-generation/ruselt/');
      /* eslint-disable */
    } catch (error) {
      Toast.error("Failed to create assignment. Please try again.2");
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
            onNext={(interest) => handleNext({ interest })}
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
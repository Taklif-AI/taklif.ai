"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PDFUpload } from "@/components/assignment/assignment-generation-steps/pdf-upload";
import { InterestsSelect } from "@/components/assignment/assignment-generation-steps/interests-select";
import { ReviewStep } from "@/components/assignment/assignment-generation-steps/review-step";
import { ProgressSteps } from "@/components/ui/progress-steps";
import { storage } from "@/lib/utils/local-storage";
import { Toast } from "@/lib/utils/toast";
import { fileToBase64 } from "@/lib/utils/files/file-to-base64";
import { v4 as uuidv4 } from 'uuid';

const steps = ["Upload PDF", "Choose Interests", "Review Inputs"];

export default function AssignmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    file: null as File | "" | null,
    interest: "",
  });
  const [runId, setRunId] = useState('');

  useEffect(() => {
    if (currentStep === 2) {
      const new_run_id = uuidv4();
      setRunId(new_run_id);
    }
  }, [currentStep]);

  useEffect(() => {
    const savedFile = storage.getProgress('PDF_FILE');
    const savedInterests = storage.getProgress('INTERESTS');
    const savedStep = storage.getProgress('CURRENT_STEP');

    if (savedFile || savedInterests) {
      setAssignmentData(prev => ({
        ...prev,
        file: savedFile,
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
    setIsPending(true);

    // prepare the assignment-data to the backend
    const dataToBackend = {
      student_interest: assignmentData.interest,
      general_assignment: "",
      is_pdf: false,
      run_id: runId,
      personalization_id: uuidv4(),
    }
    // redirect user to loadings page
    router.push('assignment-personalization/loading');


    try {
      if (assignmentData.file instanceof File) {
        try {
          const base64 = await fileToBase64(assignmentData.file);
          dataToBackend.general_assignment = base64;
          dataToBackend.is_pdf = true;

        } catch (error) {
          console.log(error);
          Toast.error("Failed to process your file. Please try again.");
        }
      } else if (typeof assignmentData.file === 'string') {
        dataToBackend.general_assignment = assignmentData.file;
        dataToBackend.is_pdf = false;
      }

      // send the assignment to the backend
      const res = await fetch('/api/assignment-personalization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToBackend)
      });

      const result = await res.json();
      // check the incoming response
      if (!res.ok || !result || result.error) {
        if (result.error.guardrail === 'interest') {
          setCurrentStep(1);
          storage.saveProgress('CURRENT_STEP', 1);
          Toast.error(result.error.rejected);
        } else if (result.error.guardrail === 'assignment') {
          setCurrentStep(0);
          storage.saveProgress('CURRENT_STEP', 0);
          Toast.error(result.error.rejected);
        } else if (result.error.guardrail === 'model_output') {
          setCurrentStep(2);
          storage.saveProgress('CURRENT_STEP', 2);
          Toast.error(result.error.rejected);
        }
        setIsPending(false);
        router.push('/assignment-personalization');
        return;
      }

      sessionStorage.removeItem("simplification_id");
      sessionStorage.setItem("run_id", dataToBackend.run_id);
      sessionStorage.setItem("personalization_id", dataToBackend.personalization_id);

      Toast.success("Assignment created successfully!");
      setIsPending(false);
      router.push('/assignment-personalization/result');

      /* eslint-disable */
    } catch (error) {
      setIsPending(false);
      Toast.error("Failed to create assignment. Please try again.2");
      router.push('/assignment-personalization');
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
            isPending={isPending}
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
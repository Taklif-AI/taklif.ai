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
import { v4 as uuidv4 } from "uuid";
import { checkAndRenewSubscription } from "@/actions/check-update-subscription";
import { decrementRemainingCredit } from "@/actions/decrement-remaining-credit";

const steps = ["Upload PDF", "Choose Interests", "Review Inputs"];

export default function AssignmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    file: null as File | "" | null,
    interest: "",
  });
  const [runId, setRunId] = useState("");

  useEffect(() => {
    document.title = "Assignment Personalization";
  }, []);

  useEffect(() => {
    if (currentStep === 2) {
      const new_run_id = uuidv4();
      setRunId(new_run_id);
    }
  }, [currentStep]);

  useEffect(() => {
    const savedFile = storage.getProgress("PDF_FILE");
    const savedInterests = storage.getProgress("INTERESTS");
    const savedStep = storage.getProgress("CURRENT_STEP");

    if (savedFile) {
      if (
        typeof savedFile === "string" &&
        savedFile.startsWith("data:application/pdf;base64,")
      ) {
        // Convert Base64 back to File
        const byteCharacters = atob(savedFile.split(",")[1]); // Remove the `data:...;base64,` prefix
        const byteNumbers = new Array(byteCharacters.length)
          .fill(0)
          .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const restoredFile = new File([blob], "your-content.pdf", {
          type: "application/pdf",
        });

        setAssignmentData((prev) => ({
          ...prev,
          file: restoredFile,
        }));
      } else {
        // It's plain text
        setAssignmentData((prev) => ({
          ...prev,
          file: savedFile,
        }));
      }
    }

    if (savedInterests) {
      setAssignmentData((prev) => ({
        ...prev,
        interest: savedInterests,
      }));
    }

    if (savedStep !== null) {
      setCurrentStep(Number(savedStep));
    }
  }, []);

  const handleNext = async (stepData: any) => {
    try {
      const updatedData = { ...assignmentData, ...stepData };
      setAssignmentData(updatedData);

      if (currentStep === 0) {
        if (stepData.file instanceof File) {
          const base64File = await fileToBase64(stepData.file);
          storage.saveProgress("PDF_FILE", base64File);
        } else {
          storage.saveProgress("PDF_FILE", stepData.file);
        }
      } else if (currentStep === 1) {
        storage.saveProgress("INTERESTS", stepData.interest);
      }

      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      storage.saveProgress("CURRENT_STEP", nextStep);
    } catch (error) {
      console.log(error);
      Toast.error("An error occurred while saving progress");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      storage.saveProgress("CURRENT_STEP", prevStep);
    }
  };

  const handleSubmit = async () => {
    setIsPending(true);

    const check = await checkAndRenewSubscription();
    if (!check) {
      setIsPending(false);
      Toast.error("Error while checking subscription!");
      router.push("/assignment-personalization");
      return;
    }
    if (check.error) {
      setIsPending(false);
      Toast.error(check.error);
      router.push("/assignment-personalization");
      return;
    }
    if (check.renewed) {
      Toast.success(check.message);
    }
    if (check.subscription) {
      if (check.subscription.remaining_credits <= 0) {
        setIsPending(false);
        Toast.error("You have no remaining credits.");
        router.push("/assignment-personalization");
        return;
      }
    }

    // prepare the assignment-data to the backend
    const dataToBackend = {
      student_interest: assignmentData.interest,
      general_assignment: "",
      is_pdf: false,
      run_id: runId,
      personalization_id: uuidv4(),
    };
    sessionStorage.setItem("allowLoadingPage", "true");
    // redirect user to loadings page
    router.push("assignment-personalization/loading");

    try {
      if (assignmentData.file instanceof File) {
        try {
          const base64 = await fileToBase64(assignmentData.file);
          dataToBackend.general_assignment = base64;
          dataToBackend.is_pdf = true;
        } catch (error) {
          console.log(error);
          Toast.error("Failed to process your file. Please try again");
        }
      } else if (typeof assignmentData.file === "string") {
        dataToBackend.general_assignment = assignmentData.file;
        dataToBackend.is_pdf = false;
      }

      // send the assignment to the backend
      const res = await fetch("/api/assignment-personalization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToBackend),
      });

      const result = await res.json();
      // check the incoming response
      if (!res.ok || !result || result.error) {
        if (result.error.guardrail === "interest") {
          setCurrentStep(1);
          storage.saveProgress("CURRENT_STEP", 1);
          Toast.error(result.error.rejected);
        } else if (result.error.guardrail === "assignment") {
          setCurrentStep(0);
          storage.saveProgress("CURRENT_STEP", 0);
          Toast.error(result.error.rejected);
        } else if (result.error.guardrail === "model_output") {
          setCurrentStep(2);
          storage.saveProgress("CURRENT_STEP", 2);
          Toast.error(result.error.rejected);
        }
        setIsPending(false);
        router.push("/assignment-personalization");
        return;
      }



      storage.clearProgress();

      sessionStorage.removeItem("simplification_id");
      sessionStorage.setItem("run_id", dataToBackend.run_id);
      sessionStorage.setItem(
        "personalization_id",
        dataToBackend.personalization_id,
      );

      const decrement = await decrementRemainingCredit();
      if (decrement.error) {
        Toast.error(decrement.error);
      }

      Toast.success("Assignment personalized successfully!");
      setIsPending(false);
      router.push("/assignment-personalization/result");
      sessionStorage.removeItem("allowLoadingPage");
      /* eslint-disable */
    } catch (error) {
      setIsPending(false);
      Toast.error("Failed to personalize assignment. Please try again");
      router.push("/assignment-personalization");
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
        <div className=" bg-[rgb(18 18 18)] backdrop-blur  p-6 rounded-lg shadow-sm">
          <ProgressSteps currentStep={currentStep} steps={steps} />
        </div>
        <div className="mt-8">{renderStep()}</div>
      </div>
    </div>
  );
}

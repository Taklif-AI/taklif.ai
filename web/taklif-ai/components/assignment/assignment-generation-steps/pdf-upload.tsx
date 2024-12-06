"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, File, X } from "lucide-react";
import { Toast } from "@/lib/utils/toast";
import { validatePDF } from "@/lib/validators/assignment-validator";
import { truncateFilename } from "@/lib/utils/truncate-file";

interface PDFUploadProps {
  onNext: (file: File) => void;
  initialFile: File | null;
}

export function PDFUpload({ onNext, initialFile }: PDFUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialFile) {
      setSelectedFile(initialFile);
    }
  }, [initialFile]);

  const validateAndSetFile = (file: File | null) => {
    if (!file) return;

    const validation = validatePDF(file);
    if (!validation.isValid) {
      Toast.error(validation.error || "Invalid file");
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = () => {
    if (selectedFile) {
      onNext(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-8 max-w-xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Upload Your PDF</h2>
        <p className="text-muted-foreground">
          Upload a PDF document (max 5MB) to generate your assignment
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-300 ${isDragging ? "border-violet-500 bg-violet-50/50 dark:bg-violet-950/20" : "border-muted"
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 bg-violet-100 dark:bg-violet-900/30 rounded-full blur-lg"></div>
              <Upload className="w-full h-full text-violet-600 dark:text-violet-400 relative z-10" />
            </div>
            <p className="mb-2">Drag and drop your PDF here, or</p>
            <div className="flex justify-center">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="application/pdf"
                onChange={handleFileChange}
              />
              <Button
                variant="secondary"
                type="button"
                onClick={handleBrowseClick}
                className="bg-violet-100 hover:bg-violet-200 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-900/50"
              >
                Browse Files
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Only PDF files up to 5MB are accepted
            </p>
          </div>
        ) : (
          <div className="bg-violet-50 dark:bg-violet-950/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                  <File className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="font-medium text-base">{truncateFilename(selectedFile.name)}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!selectedFile}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          Continue
        </Button>
      </div>
    </Card>
  );
}
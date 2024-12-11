"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, File, X , AlertCircle, FileText } from "lucide-react";
import { Toast } from "@/lib/utils/toast";
import { validatePDF } from "@/lib/validators/assignment-validator";
import { truncateFilename } from "@/lib/utils/truncate-file";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

interface PDFUploadProps {
  onNext: (file: File) => void;
  initialFile: File | string | null;
}

export function PDFUpload({ onNext, initialFile }: PDFUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialFile && typeof initialFile !== 'string' && 'type' in initialFile) {
      setSelectedFile(initialFile);
    } else if (typeof initialFile === 'string') {
      setTextContent(initialFile);
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
  const handleTextSubmit = () => {
    if (textContent.trim()) {
      onNext(textContent);
    }
  };
  const handleFileSubmit = () => {
    if (selectedFile) {
      onNext(selectedFile);
    }
  };

  return (
    <Card className="p-8 max-w-xl mx-auto">
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold mb-2">Upload Your Content</h2>
      <p className="text-muted-foreground">
        Upload a PDF document or paste your text to generate your assignment
      </p>
    </div>

    <Tabs defaultValue="file" className="space-y-6">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="file" className="flex items-center gap-2">
          <File className="h-4 w-4" />
          Upload PDF
        </TabsTrigger>
        <TabsTrigger value="text" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Enter Text
        </TabsTrigger>
      </TabsList>

      <TabsContent value="file">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <span className="ml-2">{error}</span>
          </Alert>
        )}

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-muted"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="mb-2">Drag and drop your PDF here, or</p>
          <div className="flex justify-center">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
            />
            <Button 
              variant="secondary" 
              type="button"
              onClick={handleBrowseClick}
            >
              Browse Files
            </Button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Only PDF files up to 5MB are accepted
          </p>
        </div>

        {selectedFile && (
          <div className="mt-4 p-4 bg-secondary rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <File className="h-5 w-5 mr-2" />
              <span className="text-sm">{truncateFilename(selectedFile.name, 30)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleFileSubmit}
            disabled={!selectedFile}
          >
            Continue
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="text">
        <div className="space-y-4">
          <Textarea
            placeholder="Enter or paste your text here..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="min-h-[200px]"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleTextSubmit}
              disabled={!textContent.trim()}
            >
              Continue
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  </Card>
  );
}
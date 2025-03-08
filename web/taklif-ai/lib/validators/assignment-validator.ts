export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validatePDF = (file: File): ValidationResult => {
  // Check file type
  const isValidType =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isValidType) {
    return { isValid: false, error: "Please upload a PDF file only" };
  }

  // Check if file is empty
  if (file.size === 0) {
    return { isValid: false, error: "The file appears to be empty" };
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than 5MB (current: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`,
    };
  }

  return { isValid: true };
};

export const validateInterest = (interest: string): ValidationResult => {
  const trimmedInterest = interest.trim();
  const length = trimmedInterest.length;
  const validChars = /^[a-zA-Z ]+$/; // Only a-z and A-Z

  // check the interest is existing
  if (!trimmedInterest) {
    return { isValid: false, error: "Please enter interest" };
  }

  // Check the length (minimum 3 characters, maximum 15 characters)
  if (length < 3) {
    return {
      isValid: false,
      error: "Interest should be at least 3 characters long",
    };
  }

  if (length > 40) {
    return {
      isValid: false,
      error: "Interest should be at most 40 characters long",
    };
  }

  // Check if the string contains only alphabetic characters (letters only)
  if (!validChars.test(trimmedInterest)) {
    return {
      isValid: false,
      error:
        "Interest must contain letters only (no spaces, numbers, or symbols)",
    };
  }

  return { isValid: true };
};
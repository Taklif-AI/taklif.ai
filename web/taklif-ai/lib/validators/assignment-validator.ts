export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validatePDF = (file: File): ValidationResult => {
  // Check file type
  const isValidType = file.type === "application/pdf" || file.name.toLowerCase().endsWith('.pdf');
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
      error: `File size must be less than 5MB (current: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`
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
    return { isValid: false, error: "Interest should be at least 3 characters long" };
  }

  if (length > 20) {
    return { isValid: false, error: "Interest should be at most 15 characters long" };
  }

  // Check if the string contains only alphabetic characters (letters only)
  if (!validChars.test(trimmedInterest)) {
    return { isValid: false, error: "Interest must contain letters only (no spaces, numbers, or symbols)" }
  }

  return { isValid: true };
}

export const validateDifficulty = (difficulty: string, wordCount: number): ValidationResult => {

  if (!difficulty || typeof difficulty !== 'string') {
    return { isValid: false, error: "Please select a difficulty level" };
  }

  const validDifficulties = ['easy', 'medium', 'hard'];
  if (!validDifficulties.includes(difficulty)) {
    return { isValid: false, error: "Invalid difficulty level selected" };
  }

  if (!wordCount || typeof wordCount !== 'number') {
    return { isValid: false, error: "Please enter a word count" };
  }
  if (wordCount < 100) {
    return { isValid: false, error: "Word count should be at least 100" };
  }

  if (wordCount > 1000) {
    return { isValid: false, error: "Word count should be at most 1000" };
  }

  const validNumber = /^(100|[1-9][0-9][0-9]|1000)$/;
  if (!validNumber.test(`${wordCount}`)) {
    return { isValid: false, error: "Choose an integer number in (100 - 1000)" }
  }

  return { isValid: true };
}
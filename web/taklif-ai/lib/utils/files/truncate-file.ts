import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateFilename(
  filename: string,
  maxLength: number = 30,
): string {
  if (filename.length <= maxLength) return filename;

  const extension = filename.split(".").pop() || "";
  const nameWithoutExt = filename.slice(0, filename.lastIndexOf("."));

  const truncatedLength = maxLength - extension.length - 3; // 3 for '...'
  const truncatedName = nameWithoutExt.slice(0, truncatedLength) + "...";

  return `${truncatedName}.${extension}`;
}

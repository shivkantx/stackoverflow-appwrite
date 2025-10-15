import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string.
 * Supports conditional classes, arrays, and merging Tailwind utilities.
 *
 * Example:
 * cn("text-white", isActive && "bg-blue-500", ["p-4", "rounded"])
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

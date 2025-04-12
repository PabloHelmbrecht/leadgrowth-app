import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using `clsx` and merges Tailwind CSS classes using `tailwind-merge`.
 * @param {...ClassValue[]} inputs - The class names to combine and merge.
 * @returns {string} The resulting class string after merging.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

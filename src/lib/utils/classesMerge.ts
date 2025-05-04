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

/**
 * Agrega o quita una clase de un string de clases.
 * Si la clase ya está, la elimina; si no está, la agrega.
 * @param className string de clases
 * @param toggleClassName clase a alternar
 * @returns string de clases actualizado
 */
export function toggleClass(
    className: string | undefined,
    toggleClassName: string,
): string {
    if (!className) return toggleClassName
    const classes = className.split(/\s+/).filter(Boolean)
    const hasClass = classes.includes(toggleClassName)
    const newClasses = hasClass
        ? classes.filter((c) => c !== toggleClassName)
        : [...classes, toggleClassName]
    return newClasses.join(" ")
}

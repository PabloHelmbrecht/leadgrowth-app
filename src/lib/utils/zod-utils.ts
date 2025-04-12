import { z } from "zod"
import type { supportedInputTypes } from "../constants/schemas"

/**
 * Determines the type of a Zod schema by attempting to parse various input types.
 * @param {z.ZodSchema} schema - The Zod schema to evaluate.
 * @returns {supportedInputTypes} The detected type of the schema (e.g., "string", "number", "boolean", "date", "array", or "unknown").
 */
export function getZodType(schema: z.ZodSchema): supportedInputTypes {
    if (schema.safeParse("string").success) return "string"
    if (schema.safeParse(66).success) return "number"
    if (schema.safeParse(true).success) return "boolean"
    if (schema.safeParse(new Date()).success) return "date"
    if (schema.safeParse(["string"]).success) return "array"
    return "unknown"
}

export function z_enumFromArray(array: string[]) {
    return z.enum([array[0]!, ...array.slice(1)])
}

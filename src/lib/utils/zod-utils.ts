import type { z } from "zod"
import type { supportedInputTypes } from "../constants/schemas"

export function getZodType(schema: z.ZodSchema): supportedInputTypes {
    if (schema.safeParse("string").success) return "string"
    if (schema.safeParse(66).success) return "number"
    if (schema.safeParse(true).success) return "boolean"
    if (schema.safeParse(new Date()).success) return "date"
    if (schema.safeParse(["string"]).success) return "array"
    return "unknown"
}

import { z } from "zod"

export const supportedInputTypesSchema = z.union([
    z.literal("string"),
    z.literal("number"),
    z.literal("boolean"),
    z.literal("date"),
    z.literal("array"),
    z.literal("unknown"),
])
export type supportedInputTypes = z.infer<typeof supportedInputTypesSchema>

export const supportedEntityTypesSchema = z.union([
    z.literal("contact"),
    z.literal("company"),
    z.literal("sequence"),
])
export type supportedEntityTypes = z.infer<typeof supportedEntityTypesSchema>

export const durationSchema = z.object({
    years: z.number().optional(),
    months: z.number().optional(),
    weeks: z.number().optional(),
    days: z.number().optional(),
    hours: z.number().optional(),
    minutes: z.number().optional(),
    seconds: z.number().optional(),
})

export type Duration = z.infer<typeof durationSchema>

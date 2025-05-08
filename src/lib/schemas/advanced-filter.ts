import { z } from "zod"
import { conditionalOperatorsSchema } from "./operators"

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
    z.literal("workflow"),
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

export const conjunctionSchema = z.enum(["AND", "OR"])

export const simpleFilterCriteriaDataSchema = z.object({
    type: z.literal("simple"),
    field: z.string(),
    operator: conditionalOperatorsSchema,
    value: z
        .union([
            z.string(),
            z.number(),
            z.boolean(),
            z.date(),
            z.array(z.string()),
            durationSchema,
        ])
        .nullable(),
})

export const groupFilterCriteriaDataSchema = z.object({
    type: z.literal("group"),
    conjunction: conjunctionSchema,
    filters: simpleFilterCriteriaDataSchema.array(),
})

export const filterSchema = z.discriminatedUnion("type", [
    simpleFilterCriteriaDataSchema,
    groupFilterCriteriaDataSchema,
])
export type Conjuntion = z.infer<typeof conjunctionSchema>
export type SimpleFilter = z.infer<typeof simpleFilterCriteriaDataSchema>
export type GroupFilter = z.infer<typeof groupFilterCriteriaDataSchema>
export type Filter = z.infer<typeof filterSchema>

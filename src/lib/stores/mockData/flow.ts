import { atom } from "jotai"
import { z } from "zod"

//Schemas
import { durationSchema } from "~/lib/constants/schemas"
import { conditionalOperatorsSchema } from "~/lib/constants/operators"

//Utils
import { generateId } from "~/lib/utils/formatters"

//Schemas
export const nodeSchema = z.object({
    id: z.string(),
    type: z.string().optional(),
    data: z.record(z.unknown()),
    className: z.string().optional(),
    position: z.object({
        x: z.number(),
        y: z.number(),
    }),
    style: z.object({}).optional(),
    resizing: z.boolean().optional(),
    focusable: z.boolean().optional(),
    deletable: z.boolean().optional(),
})

export const edgeSchema = z.object({
    id: z.string(),
    type: z.string().optional(),
    data: z.record(z.unknown()).optional(),
    source: z.string(),
    target: z.string(),
    className: z.string().optional(),
    sourceHandle: z.string().nullable().optional(),
    targetHandle: z.string().nullable().optional(),
    focusable: z.boolean().optional(),
    selectable: z.boolean().optional(),
    deletable: z.boolean().optional(),
})

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

//Types
export type Node = z.infer<typeof nodeSchema>
export type Edge = z.infer<typeof edgeSchema>

//Mock Data
export const edgesMockData: Edge[] = [
    {
        id: generateId(),
        source: "1",
        target: "2",
        type: "custom",
        className: "group",
        sourceHandle: "default",
        data: { delay: 1, unit: "days", order: 2 },
    },
]

//Atoms
export const edgeMockDataAtom = atom<Edge[]>(edgesMockData)

import { z } from "zod"

import { type supportedInputTypes } from "./schemas"

export const conditionalOperatorsSchema = z
    .enum([
        "contains",
        "does not contain",
        "has any of",
        "has all of",
        "has none of",
        "is within",
        "=",
        "!=",
        "<",
        ">",
        "<=",
        ">=",
        "is empty",
        "is not empty",
        "boolean search",
    ])
    .nullable()

export type conditionalOperatorsType = z.infer<
    typeof conditionalOperatorsSchema
>

export type supportedOperatorsType = {
    [key in supportedInputTypes]: {
        label: string
        value: z.infer<typeof conditionalOperatorsSchema>
    }[]
}

export const supportedOperators: supportedOperatorsType = {
    string: [
        { label: "contains", value: "contains" },
        { label: "does not contain", value: "does not contain" },
        { label: "is", value: "=" },
        { label: "is not", value: "!=" },
        { label: "is empty", value: "is empty" },
        { label: "is not empty", value: "is not empty" },
        { label: "boolean search", value: "boolean search" },
    ],
    number: [
        { label: "=", value: "=" },
        { label: "≠", value: "!=" },
        { label: "<", value: "<" },
        { label: "≥", value: ">=" },
        { label: "≤", value: "<=" },
        { label: ">", value: ">" },
        { label: "is empty", value: "is empty" },
        { label: "is not empty", value: "is not empty" },
    ],

    boolean: [
        { label: "is", value: "=" },
        { label: "is not", value: "!=" },
    ],
    date: [
        { label: "is within", value: "is within" },
        { label: "is", value: "=" },
        { label: "is before", value: "<" },
        { label: "is after", value: ">" },
        { label: "is on or before", value: "<=" },
        { label: "is on or after", value: ">=" },
        { label: "is not", value: "!=" },
        { label: "is empty", value: "is empty" },
        { label: "is not empty", value: "is not empty" },
    ],
    array: [
        { label: "has any of", value: "has any of" },
        { label: "has all of", value: "has all of" },
        { label: "has none of", value: "has none of" },
        { label: "is empty", value: "is empty" },
        { label: "is not empty", value: "is not empty" },
    ],

    unknown: [],
}

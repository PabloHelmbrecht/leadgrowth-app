//Zod

import { z } from "zod"

//Schemas
export const tagSchema = z.object({
    id: z.string().cuid(),
    label: z.string(),
    value: z.string(),
    color: z.string(),
})

//Types
export type Tag = z.infer<typeof tagSchema>

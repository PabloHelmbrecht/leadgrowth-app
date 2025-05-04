//Zod & Schemas & Types
import { z } from "zod"
import { userSchema } from "./user"
import { tagSchema } from "./tags"

//Schemas
export const workflowSchema = z.object({
    id: z.string().cuid(),
    name: z.string(),
    owner: userSchema,
    tags: z.array(tagSchema).optional(),
    status: z.enum(["active", "paused", "archived"]),
    metrics: z
        .object({
            total: z.number().optional(),
            active: z.number().optional(),
            paused: z.number().optional(),
            unsubscribed: z.number().optional(),
            bounced: z.number().optional(),
            spam: z.number().optional(),
            finished: z.number().optional(),
        })
        .optional(),
})

//Types
export type Workflow = z.infer<typeof workflowSchema>

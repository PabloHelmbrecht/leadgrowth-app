//Zod

import { z } from "zod"

//Schemas
export const userSchema = z.object({
    id: z.string().cuid(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    role: z.enum(["[admin", "non_admin"]),
    status: z.enum(["active", "disabled", "deleteds"]),
})

//Types
export type User = z.infer<typeof userSchema>

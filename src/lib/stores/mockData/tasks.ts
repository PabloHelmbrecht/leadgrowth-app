import { atom } from "jotai"
import { z } from "zod"
// import { generateId } from "~/lib/utils/formatters"
import { prioritySchema, statusSchema, eventsSchema } from "./system"
import { contactSchema } from "./contact"
import { userSchema } from "./users"


//Todo: Falta type
//Schemas
export const taskSchema = z.object({
    id: z.string(),
    user_id: z.string(),
    user: userSchema,
    created_at: z.date(),
    completed_at: z.date(),
    note: z.string().optional(),
    skipped_at: z.date(),
    due_at: z.string(),
    type: z.unknown(),
    priority: prioritySchema.shape.value,
    status: statusSchema.shape.value,
    contact_id: z.string(),
    events: z.array(eventsSchema),
    workflow_id: z.string(),
    contact: contactSchema
})

//Types
export type Task = z.infer<typeof taskSchema>


//Data
export const tasksMockData: Task[] = []




//Atoms
export const tasksMockDataAtom = atom<Task[]>(tasksMockData)


//Jotai
import { atom } from "jotai"

//Zod & Schemas
import { z } from "zod"
import { prioritySchema, statusSchema, eventsSchema } from "./system"
import { contactSchema, contactsMockData } from "./contact"
import { userSchema, usersMockData } from "./users"
import { workflowsMockData, workflowSchema } from "./workflow"
import { nodeSchema } from "./flow"

//Constants
import { flowActions } from "~/lib/constants/flow-actions"

//Utils
import { generateId } from "~/lib/utils/formatters"
import { z_enumFromArray } from "~/lib/utils/zod-utils"

//Schemas
export const actionSchema = z.object({
    id: z.string(),
    user_id: z.string(),
    user: userSchema,
    created_at: z.date(),
    completed_at: z.date().optional(),
    scheduled_at: z.date().optional(),
    executed_at: z.date().optional(),
    note: z.string().optional(),
    skipped_at: z.date().optional(),
    due_at: z.date().optional(),
    type: z_enumFromArray(flowActions.map(({ type }) => type)),
    priority: prioritySchema.shape.value,
    status: statusSchema.shape.value,
    contact_id: z.string(),
    events: z.array(eventsSchema),
    workflow_id: z.string(),
    workflow: workflowSchema,
    contact: contactSchema,
    node_id: z.string(),
    node: nodeSchema,
})

//Types
export type Action = z.infer<typeof actionSchema>

//Data
export const actionsMockData: Action[] = [
    {
        id: generateId(),
        user_id: usersMockData[0]!.id,
        user: usersMockData[0]!,
        created_at: new Date("2025-04-01T10:00:00Z"),
        completed_at: new Date("2025-04-05T12:00:00Z"),
        scheduled_at: new Date("2025-04-05T12:00:00Z"),
        executed_at: new Date("2025-04-05T12:00:00Z"),
        note: "This is a sample task note.",
        skipped_at: new Date("2025-04-03T15:00:00Z"),
        due_at: new Date("2025-04-10T23:59:59Z"),
        type: "manualEmail",
        priority: "high",
        status: "completed",
        contact_id: "contact-1",
        events: [
            {
                id: generateId(),
                type: "emailOpened",
                date: new Date("2021-01-01"),
            },
            {
                id: generateId(),
                type: "emailClicked",
                date: new Date("2021-01-02"),
            },
            {
                id: generateId(),
                type: "emailReplied",
                date: new Date("2021-01-03"),
            },
        ],
        workflow_id: workflowsMockData[0]!.id,
        workflow: workflowsMockData[0]!,
        contact: contactsMockData[0]!,
        node_id: workflowsMockData[0]!.flow.nodes[1]!.id,
        node: workflowsMockData[0]!.flow.nodes[1]!,
    },
    {
        id: generateId(),
        user_id: usersMockData[0]!.id,
        user: usersMockData[0]!,
        created_at: new Date("2025-04-01T10:00:00Z"),
        completed_at: new Date("2025-04-05T12:00:00Z"),
        scheduled_at: new Date("2025-04-05T12:00:00Z"),
        executed_at: new Date("2025-04-05T12:00:00Z"),
        note: "This is a sample task note.",
        skipped_at: new Date("2025-04-03T15:00:00Z"),
        due_at: new Date("2025-04-10T23:59:59Z"),
        type: "linkedinPostInteraction",
        priority: "medium",
        status: "completed",
        contact_id: "contact-1",
        events: [
            {
                id: generateId(),
                type: "emailOpened",
                date: new Date("2021-01-01"),
            },
            {
                id: generateId(),
                type: "emailClicked",
                date: new Date("2021-01-02"),
            },
            {
                id: generateId(),
                type: "emailReplied",
                date: new Date("2021-01-03"),
            },
        ],
        workflow_id: workflowsMockData[0]!.id,
        workflow: workflowsMockData[0]!,
        contact: contactsMockData[0]!,
        node_id: workflowsMockData[0]!.flow.nodes[1]!.id,
        node: workflowsMockData[0]!.flow.nodes[1]!,
    },
    {
        id: generateId(),
        user_id: usersMockData[0]!.id,
        user: usersMockData[0]!,
        created_at: new Date("2025-04-01T10:00:00Z"),
        completed_at: undefined,
        scheduled_at: new Date("2025-04-05T12:00:00Z"),
        executed_at: new Date("2025-04-05T12:00:00Z"),
        note: "This is a sample task note.",
        skipped_at: undefined,
        due_at: new Date("2025-04-10T23:59:59Z"),
        type: "linkedinPostInteraction",
        priority: "medium",
        status: "pending",
        contact_id: "contact-1",
        events: [
            {
                id: generateId(),
                type: "emailOpened",
                date: new Date("2021-01-01"),
            },
            {
                id: generateId(),
                type: "emailClicked",
                date: new Date("2021-01-02"),
            },
            {
                id: generateId(),
                type: "emailReplied",
                date: new Date("2021-01-03"),
            },
        ],
        workflow_id: workflowsMockData[0]!.id,
        workflow: workflowsMockData[0]!,
        contact: contactsMockData[0]!,
        node_id: workflowsMockData[0]!.flow.nodes[1]!.id,
        node: workflowsMockData[0]!.flow.nodes[1]!,
    },
]

//Atoms
export const actionsMockDataAtom = atom<Action[]>(actionsMockData)

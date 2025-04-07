import { atom } from "jotai"
import { z } from "zod"

import { nodeSchema, edgeSchema } from "./flow"

//Schemas
export const tagSchema = z.object({
    value: z.string(),
    label: z.string(),
    color: z.string(),
})

export const statusSchema = z.object({
    value: z.enum(["active", "paused", "archived"], {
        message: "Status must be active, paused or archived",
    }),
    label: z.string(),
    color: z.string(),
})

export const ownerSchema = z.object({
    value: z.string(),
    label: z.string(),
})

export const workflowSchema = z.object({
    id: z.string(),
    name: z.string({ message: "Workflow must have a name" }),
    tag: z.array(tagSchema.shape.value),
    status: statusSchema.shape.value,
    owner: ownerSchema.shape.value,
    activeProspectsCount: z.number().optional(),
    pausedProspectsCount: z.number().optional(),
    notSendCount: z.number().optional(),
    openCount: z.number().optional(),
    replyCount: z.number().optional(),
    interestedCount: z.number().optional(),
    totalCount: z.number().optional(),
    flow: z.object({
        nodes: z.array(nodeSchema),
        edges: z.array(edgeSchema),
    }),
})

//Types
export type Workflow = z.infer<typeof workflowSchema>
export type Tag = z.infer<typeof tagSchema>
export type Status = z.infer<typeof statusSchema>
export type Owner = z.infer<typeof ownerSchema>

//Data
export const workflowsMockData: Workflow[] = [
    {
        id: "728ed52fw",
        tag: ["secondary", "starred"],
        status: "active",
        name: "Prioritarios IT",
        owner: "fabiolabarrios",
        activeProspectsCount: 123,
        pausedProspectsCount: 24,
        notSendCount: 23,
        openCount: 100,
        replyCount: 5,
        interestedCount: 2,
        totalCount: 200,
        flow: {
            nodes: [
                {
                    id: "0",
                    type: "trigger",
                    className: "group",
                    deletable: false,
                    data: {
                        triggers: [
                            {
                                id: "000000000",
                                type: "manualActivation",
                                parameters: {},
                            },
                        ],
                        filterCriteria: {
                            conjunction: "AND",
                            filters: [
                                {
                                    type: "simple",
                                    field: "isActive",
                                    operator: "=",
                                    value: true,
                                },
                                {
                                    type: "group",
                                    conjunction: "OR",
                                    filters: [
                                        {
                                            type: "simple",
                                            field: "email",
                                            operator: "contains",
                                            value: "in progress",
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    position: { x: 0, y: 0 },
                },
                {
                    id: "1",
                    type: "manualEmail",
                    className: "group",
                    data: {
                        subject: "",
                        body: "",
                        isReply: false,
                        includeSignature: false,
                    },
                    position: { x: 0, y: 600 },
                },
                {
                    id: "2",
                    type: "manualEmail",
                    className: "group",
                    data: {
                        subject: "",
                        body: "",
                        isReply: false,
                        includeSignature: false,
                    },

                    position: { x: 0, y: 1000 },
                },
            ],
            edges: [
                {
                    id: "1-2",
                    source: "1",
                    target: "2",
                    type: "custom",
                    className: "group",
                    sourceHandle: "default",
                    data: {
                        delay: 1,
                        unit: "days",
                        order: 2,
                    },
                },
                {
                    id: "0-1",
                    source: "0",
                    target: "1",
                    type: "custom",
                    className: "group",
                    sourceHandle: "default",
                    data: {
                        delay: 1,
                        unit: "days",
                        order: 2,
                    },
                },
            ],
        },
    },
    {
        id: "728ed5e2f",
        tag: ["secondary", "starred"],
        status: "active",
        name: "Prioritarios IT",
        owner: "fabiolabarrios",
        activeProspectsCount: 123,
        pausedProspectsCount: 24,
        notSendCount: 23,
        openCount: 100,
        replyCount: 5,
        interestedCount: 2,
        totalCount: 200,
        flow: {
            nodes: [],
            edges: [],
        },
    },
    {
        id: "728ed52gf",
        tag: ["secondary", "starred"],
        status: "active",
        name: "Prioritarios RRHH",
        owner: "fabiolabarrios",
        activeProspectsCount: 123,
        pausedProspectsCount: 24,
        notSendCount: 23,
        openCount: 100,
        replyCount: 5,
        interestedCount: 2,
        totalCount: 200,
        flow: {
            nodes: [],
            edges: [],
        },
    },
    {
        id: "728erd52f",
        tag: ["secondary", "starred"],
        status: "active",
        name: "Prioritarios RRHH",
        owner: "fabiolabarrios",
        activeProspectsCount: 123,
        pausedProspectsCount: 24,
        notSendCount: 23,
        openCount: 100,
        replyCount: 5,
        interestedCount: 2,
        totalCount: 200,
        flow: {
            nodes: [],
            edges: [],
        },
    },
    {
        id: "728ed542f",
        tag: ["secondary", "starred"],
        status: "active",
        name: "Secondarios RRHH",
        owner: "pablohelmbrecht",
        activeProspectsCount: 123,
        pausedProspectsCount: 24,
        notSendCount: 23,
        openCount: 100,
        replyCount: 5,
        interestedCount: 2,
        totalCount: 200,
        flow: {
            nodes: [],
            edges: [],
        },
    },
    {
        id: "728eld52f",
        tag: ["primary", "starred"],
        status: "paused",
        name: "Secondarios RRHH",
        owner: "pablohelmbrecht",
        activeProspectsCount: 123,
        pausedProspectsCount: 24,
        notSendCount: 23,
        openCount: 100,
        replyCount: 5,
        interestedCount: 2,
        totalCount: 200,
        flow: {
            nodes: [],
            edges: [],
        },
    },
    {
        id: "728ed5x2f",
        tag: ["primary", "starred"],
        status: "paused",
        name: "Secondarios RRHH",
        owner: "pablohelmbrecht",
        activeProspectsCount: 123,
        pausedProspectsCount: 24,
        notSendCount: 23,
        openCount: 100,
        replyCount: 5,
        interestedCount: 2,
        totalCount: 200,
        flow: {
            nodes: [],
            edges: [],
        },
    },
    {
        id: "728edk52f",
        tag: ["primary"],
        status: "archived",
        name: "Secondarios IT",
        owner: "martinhernandez",
        activeProspectsCount: 123,
        pausedProspectsCount: 24,
        notSendCount: 23,
        openCount: 100,
        replyCount: 5,
        interestedCount: 2,
        totalCount: 200,
        flow: {
            nodes: [],
            edges: [],
        },
    },
    {
        id: "728edu52f",
        tag: ["primary"],
        status: "archived",
        name: "Secondarios IT",
        owner: "martinhernandez",
        activeProspectsCount: 123,
        pausedProspectsCount: 24,
        notSendCount: 234,
        openCount: 100,
        replyCount: 5,
        interestedCount: 2,
        totalCount: 200,
        flow: {
            nodes: [],
            edges: [],
        },
    },
    {
        id: "728edl52f",
        tag: ["primary"],
        status: "archived",
        name: "Secondarios IT",
        owner: "martinhernandez",
        activeProspectsCount: 123,
        pausedProspectsCount: 24,
        notSendCount: 23,
        openCount: 100,
        replyCount: 5,
        interestedCount: 2,
        totalCount: 200,
        flow: {
            nodes: [],
            edges: [],
        },
    },
]

export const tagsMockData: Tag[] = [
    {
        value: "starred",
        label: "Starred",
        color: "#eab308",
    },
    {
        value: "secondary",
        label: "Secondary",
        color: "#f59e0bs",
    },
    {
        value: "primary",
        label: "Primary",
        color: "#10b981",
    },
    {
        value: "technology",
        label: "Technology",
        color: "#0ea5e9",
    },
    {
        value: "humanresources",
        label: "Human Resources",
        color: "#a855f7",
    },
    {
        value: "sales",
        label: "Sales",
        color: "#f97316",
    },
]

export const statusMockData: Status[] = [
    {
        value: "active",
        label: "Active",
        color: "#10b981",
    },
    {
        value: "paused",
        label: "Paused",
        color: "#f59e0bs",
    },
    {
        value: "archived",
        label: "Archived",
        color: "#ef4444",
    },
]

export const ownersMockData: Owner[] = [
    {
        value: "pablohelmbrecht",
        label: "Pablo Helmbrecht",
    },
    {
        value: "fabiolabarrios",
        label: "Fabiola Barrios",
    },
    {
        value: "juanperez",
        label: "Juan Perez",
    },
    {
        value: "pedrolozada",
        label: "Pedro Lozada",
    },
    {
        value: "martinhernandez",
        label: "Martín Hernandez",
    },
]

//Atoms
export const workflowsMockDataAtom = atom<Workflow[]>(workflowsMockData)
export const tagsMockDataAtom = atom<Tag[]>(tagsMockData)
export const statusMockDataAtom = atom<Status[]>(statusMockData)
export const ownersMockDataAtom = atom<Owner[]>(ownersMockData)

import { atom } from "jotai"
import { z } from "zod"
import { generateId } from "~/lib/utils/formatters"

//Schemas
export const eventsSchema = z.object({
    id: z.string(),
    type: z.enum([
        "emailOpened",
        "emailClicked",
        "emailReplied",
        "linkedinConnectionAccepted",
        "linkedinMessageReplied",
        "callConnected",
        "callUnanswered",
        "callPositive",
        "meetingScheduled",
        "websiteVisited",
        "meetingCompleted",
        "meetingCancelled",
    ]),
    date: z.date(),
})

export const statusSchema = z.object({
    value: z.enum([
        "active",
        "paused",
        "unsubscribed",
        "bounced",
        "spam",
        "finished",
    ]),
    label: z.string(),
    color: z.string(),
})

export const companySchema = z.object({
    value: z.string(),
    label: z.string(),
})

export const stepSchema = z.object({
    value: z.string(),
    label: z.string(),
})

export const stageSchema = z.object({
    value: z.string(),
    label: z.string(),
    color: z.string(),
})

export const contactSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    company: companySchema.shape.value,
    title: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.number(),
    country: z.string(),
    events: z.array(eventsSchema),
    isActive: z.boolean(),
    createdAt: z.date(),
    status: statusSchema.shape.value,
    stage: stageSchema.shape.value,
    step: stepSchema.shape.value,
})

//Types
export type Contact = z.infer<typeof contactSchema>
export type Company = z.infer<typeof companySchema>
export type Status = z.infer<typeof statusSchema>
export type Step = z.infer<typeof stepSchema>
export type Stage = z.infer<typeof stageSchema>

//Data

export const contactsMockData: Contact[] = [
    {
        id: generateId(),
        firstName: "John",
        lastName: "Doe",
        email: "jdoe@company.com",
        phone: "123-456-7890",
        company: "Company Inc.",
        title: "CEO",
        address: "123 Main St.",
        city: "Anytown",
        state: "CA",
        zip: 12345,
        country: "USA",
        status: "active",
        stage: "In progress",
        step: "1",
        isActive: true,
        createdAt: new Date("2021-01-01"),
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
    },
    {
        id: generateId(),
        firstName: "John",
        lastName: "Doe",
        email: "jdoe@company.com",
        phone: "123-456-7890",
        company: "Company Inc.",
        title: "CEO",
        address: "123 Main St.",
        city: "Anytown",
        state: "CA",
        zip: 12345,
        country: "USA",
        status: "bounced",
        stage: "In progress",
        step: "1",
        isActive: true,
        createdAt: new Date("2021-01-01"),
        events: [
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
    },
    {
        id: generateId(),
        firstName: "John",
        lastName: "Doe",
        email: "jdoe@company.com",
        phone: "123-456-7890",
        company: "Company Inc.",
        title: "CEO",
        address: "123 Main St.",
        city: "Anytown",
        state: "CA",
        zip: 12345,
        country: "USA",
        status: "paused",
        stage: "In progress",
        step: "1",
        isActive: true,
        createdAt: new Date("2021-01-01"),
        events: [
            {
                id: generateId(),
                type: "emailOpened",
                date: new Date("2021-01-01"),
            },
        ],
    },
    {
        id: generateId(),
        firstName: "John",
        lastName: "Doe",
        email: "jdoe@company.com",
        phone: "123-456-7890",
        company: "Company Inc.",
        title: "CEO",
        address: "123 Main St.",
        city: "Anytown",
        state: "CA",
        zip: 12345,
        country: "USA",
        status: "finished",
        stage: "Replied",
        step: "A13",
        isActive: true,
        createdAt: new Date("2021-01-01"),
        events: [],
    },
]

export const companiesMockData: Company[] = [
    {
        value: "Company Inc.",
        label: "Company Inc.",
    },
    {
        value: "Company LLC",
        label: "Company LLC",
    },
    {
        value: "Company Corp.",
        label: "Company Corp.",
    },
]

export const statusMockData: Status[] = [
    {
        value: "active",
        label: "Active",
        color: "bg-primary-500",
    },
    {
        value: "paused",
        label: "Paused",
        color: "bg-neutral-500",
    },
    {
        value: "unsubscribed",
        label: "Unsubscribed",
        color: "bg-danger-500",
    },
    {
        value: "bounced",
        label: "Bounced",
        color: "bg-danger-500",
    },
    {
        value: "spam",
        label: "Spam",
        color: "bg-danger-500",
    },
    {
        value: "finished",
        label: "Finished",
        color: "bg-success-500",
    },
]

export const stepsMockData: Step[] = [
    {
        value: "1",
        label: "1",
    },
    {
        value: "2",
        label: "2",
    },
    {
        value: "3",
        label: "3",
    },
]

export const stagesMockData: Stage[] = [
    {
        value: "New",
        label: "New",
        color: "bg-neutral-500",
    },
    {
        value: "In progress",
        label: "In progress",
        color: "bg-neutral-500",
    },
    {
        value: "Replied",
        label: "Replied",
        color: "bg-neutral-500",
    },
    {
        value: "Interested",
        label: "Interested",
        color: "bg-success-500",
    },
    {
        value: "Not Interested",
        label: "Not Interested",
        color: "bg-danger-500",
    },
    {
        value: "Finished",
        label: "Finished",
        color: "bg-success-500",
    },
]

//Atoms
export const contactsMockDataAtom = atom<Contact[]>(contactsMockData)
export const companiesMockDataAtom = atom<Company[]>(companiesMockData)
export const statusMockDataAtom = atom<Status[]>(statusMockData)
export const stepsMockDataAtom = atom<Step[]>(stepsMockData)
export const stagesMockDataAtom = atom<Stage[]>(stagesMockData)

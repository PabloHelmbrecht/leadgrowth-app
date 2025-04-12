import { atom } from "jotai"
import { z } from "zod"

//Colors
import config from "tailwind.config"
const colors = config.theme.extend.colors

//Schemas
export const activitySchema = z.object({
    type: z.enum([
        "system",
        "note",
        "click",
        "open",
        "reply",
        "email sent",
        "email scheduled",
        "unsubscription",
        "email bounced",
        "call",
        "linkedin",
    ]),
    timestamp: z.date(),
    title: z.string(),
    description: z.string(),
    path: z.string().optional(),
})

export const notificationSchema = z.object({
    priority: z.enum(["low", "medium", "high"]),
    timestamp: z.date(),
    title: z.string(),
    description: z.string(),
    unseen: z.boolean().optional(),
    path: z.string().optional(),
})

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

export const stepSchema = z.string()

export const prioritySchema = z.object({
    label: z.string(),
    value: z.enum(["high", "medium", "low"]),
    color: z.string(),
})

export const statusSchema = z.object({
    label: z.string(),
    value: z.enum([
        "scheduled",
        "completed",
        "skipped",
        "error",
        "delayed",
        "pending",
    ]),
    color: z.string().optional(),
})

//Types
export type Activity = z.infer<typeof activitySchema>
export type Notification = z.infer<typeof notificationSchema>
export type Event = z.infer<typeof eventsSchema>
export type Step = z.infer<typeof stepSchema>
export type Priority = z.infer<typeof prioritySchema>
export type Status = z.infer<typeof statusSchema>

//Data
export const activitiesMockData: Activity[] = [
    {
        type: "system",
        timestamp: new Date("2024-06-22T03:24:00"),
        title: "System Update",
        description: "Prospected added trough Linkedin extension",
        path: "/",
    },
    {
        type: "note",
        timestamp: new Date(),
        title: "Notes",
        description: "Prospected added trough Linkedin extension",
        path: "/",
    },
    {
        type: "click",
        timestamp: new Date("2024-06-21T03:24:00"),
        title: "Email clicked",
        description: "Prospected added trough Linkedin extension",
        path: "/",
    },
    {
        type: "open",
        timestamp: new Date("2024-06-12T03:24:00"),
        title: "Email opened",
        description: "Prospected added trough Linkedin extension",
        path: "/",
    },
    {
        type: "reply",
        timestamp: new Date("2024-06-12T03:24:00"),
        title: "Email replied",
        description: "Prospected added trough Linkedin extension",
        path: "/",
    },
    {
        type: "email sent",
        timestamp: new Date("2024-05-22T03:24:00"),
        title: "Email sent",
        description: "Prospected added trough Linkedin extension",
        path: "/",
    },
    {
        type: "email scheduled",
        timestamp: new Date("2023-06-22T03:24:00"),
        title: "Email scheduled",
        description: "Prospected added trough Linkedin extension",
        path: "/",
    },

    {
        type: "unsubscription",
        timestamp: new Date("2023-06-22T03:24:00"),
        title: "Prospect unsubscribed",
        description: "Prospected added trough Linkedin extension",
        path: "/",
    },
    {
        type: "email bounced",
        timestamp: new Date("2023-06-22T03:24:00"),
        title: "Email bounced",
        description: "Prospected added trough Linkedin extension",
        path: "/",
    },
    {
        type: "call",
        timestamp: new Date("2023-06-22T03:24:00"),
        title: "Prospect called",
        description: "Prospected added trough Linkedin extension",
        path: "/",
    },
    {
        type: "linkedin",
        timestamp: new Date("2023-06-22T03:24:00"),
        title: "Likedin activity",
        description: "Prospected added trough Linkedin extension",
        path: "/",
    },
]

export const notificationsMockData: Notification[] = [
    {
        priority: "low",
        timestamp: new Date("2024-06-22T03:24:00"),
        title: "Priority Low",
        description: "Prospected added trough Linkedin extension",
        path: "/",
        unseen: true,
    },
    {
        priority: "medium",
        timestamp: new Date(),
        title: "Priority Medium",
        description: "Prospected added trough Linkedin extension",
        path: "/",
    },
    {
        priority: "high",
        timestamp: new Date("2024-06-21T03:24:00"),
        title: "Priority High",
        description: "Prospected added trough Linkedin extension",
        path: "/",
    },
]

export const stepsMockData: Step[] = ["1", "2", "3"]

export const priorityMockData: Priority[] = [
    {
        label: "High",
        value: "high",
        color: colors.danger[500],
    },
    {
        label: "Medium",
        value: "medium",
        color: colors.warning[500],
    },
    {
        label: "Low",
        value: "low",
        color: colors.neutral[500],
    },
]

export const statusMockData: Status[] = [
    {
        label: "Scheduled",
        value: "scheduled",
        color: colors.primary[500],
    },
    {
        label: "Completed",
        value: "completed",
        color: colors.success[500],
    },
    {
        label: "Skipped",
        value: "skipped",
        color: colors.neutral[500],
    },
    {
        label: "Pending",
        value: "pending",
        color: colors.neutral[500],
    },
    {
        label: "Delayed",
        value: "delayed",
        color: colors.warning[500],
    },
    {
        label: "Error",
        value: "error",
        color: colors.danger[500],
    },
]

//Atoms
export const activitiesMockDataAtom = atom<Activity[]>(activitiesMockData)
export const notificationsMockDataAtom = atom<Notification[]>(
    notificationsMockData,
)
export const stepsMockDataAtom = atom<Step[]>(stepsMockData)
export const priorityMockDataAtom = atom<Priority[]>(priorityMockData)
export const statusMockDataAtom = atom<Status[]>(statusMockData)

import { atom } from "jotai"
import { z } from "zod"

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

//Types
export type Activity = z.infer<typeof activitySchema>
export type Notification = z.infer<typeof notificationSchema>

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

//Atoms
export const activitiesMockDataAtom = atom<Activity[]>(activitiesMockData)
export const notificationsMockDataAtom = atom<Notification[]>(
    notificationsMockData,
)

import { atom } from "jotai"
import { z } from "zod"

// ---------------------- SEQUENCES ---------------------- //

//Schemas
export const sequenceSchema = z.object({
  id: z.string(),
  name: z.string({ message: "Sequence must have a name" }),
  tag: z.array(z.string()),
  status: z.enum(["active", "paused", "archived"]),
  owner: z.string({ message: "Sequence must have an owner" }),
  activeProspectsCount: z.number().optional(),
  pausedProspectsCount: z.number().optional(),
  notSendCount: z.number().optional(),
  openCount: z.number().optional(),
  replyCount: z.number().optional(),
  interestedCount: z.number().optional(),
  totalCount: z.number().optional(),
})

export const tagSchema = z.object({
  value: z.string(),
  label: z.string(),
  color: z.string(),
})

export const statusSchema = z.object({
  value: z.string(),
  label: z.string(),
  color: z.string(),
})

export const ownerSchema = z.object({
  value: z.string(),
  label: z.string(),
})

//Types
export type Sequence = z.infer<typeof sequenceSchema>
export type Tag = z.infer<typeof tagSchema>
export type Status = z.infer<typeof statusSchema>
export type Owner = z.infer<typeof ownerSchema>

//Data
export const sequencesMockData: Sequence[] = [
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
    color: "#f59e0b",
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
    color: "primary",
  },
  {
    value: "paused",
    label: "Paused",
    color: "neutral",
  },
  {
    value: "archived",
    label: "Archived",
    color: "danger",
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
export const sequencesMockDataAtom = atom<Sequence[]>(sequencesMockData)
export const tagsMockDataAtom = atom<Tag[]>(tagsMockData)
export const statusMockDataAtom = atom<Status[]>(statusMockData)
export const ownersMockDataAtom = atom<Owner[]>(ownersMockData)

import { atom } from "jotai"
import { z } from "zod"

//Schemas

export const nodeSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  data: z.record(z.unknown()),
  className: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  style: z.object({}).optional(),
  resizing: z.boolean().optional(),
  focusable: z.boolean().optional(),
})

export const edgeSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  data: z.record(z.unknown()).optional(),
  source: z.string(),
  target: z.string(),
  className: z.string().optional(),
  sourceHandle: z.string().nullable().optional(),
  targetHandle: z.string().nullable().optional(),
  focusable: z.boolean().optional(),
  selectable: z.boolean().optional(),
  deletable: z.boolean().optional(),
})

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
  flow: z.object({
    nodes: z.array(nodeSchema),
    edges: z.array(edgeSchema),
  }),
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
export type Sequence = z.infer<typeof sequenceSchema>
export type Tag = z.infer<typeof tagSchema>
export type Status = z.infer<typeof statusSchema>
export type Owner = z.infer<typeof ownerSchema>
export type Activity = z.infer<typeof activitySchema>
export type Notification = z.infer<typeof notificationSchema>
export type Node = z.infer<typeof nodeSchema>
export type Edge = z.infer<typeof edgeSchema>

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
    flow: {
      nodes: [
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
          position: { x: 0, y: 50 },
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

          position: { x: -400, y: 400 },
        },
        {
          id: "3",
          type: "manualEmail",
          className: "group",
          data: {
            subject: "",
            body: "",
            isReply: false,
            includeSignature: false,
          },
          position: { x: 400, y: 400 },
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
          data: { delay: 1, unit: "days", order: 2 },
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

export const edgesMockData: Edge[] = [
  {
    id: "1-2",
    source: "1",
    target: "2",
    type: "custom",
    className: "group",
    sourceHandle: "default",
    data: { delay: 1, unit: "days", order: 2 },
  },
]

//Atoms
export const sequencesMockDataAtom = atom<Sequence[]>(sequencesMockData)
export const tagsMockDataAtom = atom<Tag[]>(tagsMockData)
export const statusMockDataAtom = atom<Status[]>(statusMockData)
export const ownersMockDataAtom = atom<Owner[]>(ownersMockData)
export const activitiesMockDataAtom = atom<Activity[]>(activitiesMockData)
export const notificationsMockDataAtom = atom<Notification[]>(
  notificationsMockData,
)
export const edgeMockDataAtom = atom<Edge[]>(edgesMockData)

export function nodeSelectorReducer(sequenceId: string) {
  const selector = (sequences: Sequence[]) => {
    const foundSequence = sequences.find(({ id }) => sequenceId === id)
    if (!foundSequence) return []
    const nodes = foundSequence.flow.nodes
    return nodes
  }

  const reducer = (
    sequences: Sequence[],
    newNodes: Node[] | ((nodes: Node[]) => Node[]),
  ) => {
    const foundSequence = sequences.find(({ id }) => sequenceId === id)
    if (!foundSequence) return sequences
    foundSequence.flow.nodes =
      typeof newNodes === "function"
        ? newNodes(foundSequence.flow.nodes)
        : newNodes
    const newSequences = sequences.map((sequence) =>
      sequence.id === foundSequence.id ? foundSequence : sequence,
    )

    return newSequences
  }
  return { selector, reducer }
}

export function edgeSelectorReducer(sequenceId: string) {
  const selector = (sequences: Sequence[]) => {
    const foundSequence = sequences.find(({ id }) => sequenceId === id)
    if (!foundSequence) return []
    const edges = foundSequence.flow.edges
    return edges
  }

  const reducer = (
    sequences: Sequence[],
    newEdges: Edge[] | ((edges: Edge[]) => Edge[]),
  ) => {
    const foundSequence = sequences.find(({ id }) => sequenceId === id)
    if (!foundSequence) return sequences

    foundSequence.flow.edges =
      typeof newEdges === "function"
        ? newEdges(foundSequence.flow.edges)
        : newEdges
    const newSequences = sequences.map((sequence) =>
      sequence.id === foundSequence.id ? foundSequence : sequence,
    )
    return newSequences
  }
  return { selector, reducer }
}

export function uniqueNodeSelectorReducer(sequenceId: string, nodeId: string) {
  const selector = (sequences: Sequence[]) => {
    const foundSequence = sequences.find(({ id }) => sequenceId === id)
    if (!foundSequence) {
      return
      throw new Error(`Sequence Id ${sequenceId} is not valid.`)
    }
    const foundNode = foundSequence.flow.nodes.find(({ id }) => nodeId === id)
    if (!foundNode) {
      return
      throw new Error(`Node Id ${nodeId} is not valid.`)
    }
    return foundNode
  }

  const reducer = (
    sequences: Sequence[],
    newNode: Node | ((nodes: Node) => Node),
  ) => {
    const foundSequence = sequences.find(({ id }) => sequenceId === id)
    if (!foundSequence) {
      return sequences
      throw new Error(`Sequence Id ${sequenceId} is not valid.`)
    }

    const foundNode = foundSequence.flow.nodes.find(({ id }) => nodeId === id)
    if (!foundNode) {
      return sequences
      throw new Error(`Node Id ${nodeId} is not valid.`)
    }

    const newSequences = sequences.map((sequence) => {
      if (sequence.id !== foundSequence.id) return sequence

      sequence.flow.nodes = sequence.flow.nodes.map((node) => {
        if (node.id !== foundNode.id) return node

        return typeof newNode === "function" ? newNode(foundNode) : newNode
      })

      return sequence
    })

    return newSequences
  }
  return { selector, reducer }
}

export function uniqueEdgeSelectorReducer(sequenceId: string, edgeId: string) {
  const selector = (sequences: Sequence[]) => {
    const foundSequence = sequences.find(({ id }) => sequenceId === id)
    if (!foundSequence)
      throw new Error(`Sequence Id ${sequenceId} is not valid.`)
    const foundEdge = foundSequence.flow.edges.find(({ id }) => edgeId === id)
    if (!foundEdge) {
      return
      throw new Error(`Edge Id ${edgeId} is not valid.`)
    }
    return foundEdge
  }

  const reducer = (
    sequences: Sequence[],
    newEdge: Edge | ((edge: Edge) => Edge),
  ) => {
    const foundSequence = sequences.find(({ id }) => sequenceId === id)
    if (!foundSequence)
      throw new Error(`Sequence Id ${sequenceId} is not valid.`)

    const foundEdge = foundSequence.flow.edges.find(({ id }) => edgeId === id)
    if (!foundEdge) {
      return sequences
      throw new Error(`Edge Id ${edgeId} is not valid.`)
    }
    const newSequences = sequences.map((sequence) => {
      if (sequence.id !== foundSequence.id) return sequence

      sequence.flow.edges = sequence.flow.edges.map((edge) => {
        if (edge.id !== foundEdge.id) return edge

        return typeof newEdge === "function" ? newEdge(foundEdge) : newEdge
      })

      return sequence
    })

    return newSequences
  }
  return { selector, reducer }
}

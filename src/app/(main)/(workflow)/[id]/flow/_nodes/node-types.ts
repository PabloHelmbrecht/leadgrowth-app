//React Flow
import { type NodeTypes } from "@xyflow/react"

import { emailDataSchema, ManualEmailNode } from "./manual-email-node"

import { triggerNodeDataSchema, TriggerNode } from "./trigger-node"

export const nodeStructures = [
    {
        type: "trigger" as const,
        component: TriggerNode,
        dataSchema: triggerNodeDataSchema,
    },
    {
        type: "manualEmail" as const,
        component: ManualEmailNode,
        dataSchema: emailDataSchema,
    },
    {
        type: "placeholder" as const,
        component: ManualEmailNode,
        dataSchema: emailDataSchema,
    },
]

export const nodeTypes: NodeTypes = Object.fromEntries(
    nodeStructures.map((node) => [node.type, node.component]),
)

export const nodeTypesDataSchemas = Object.fromEntries(
    nodeStructures.map((node) => [node.type, node.dataSchema]),
)

export type NodeType = (typeof nodeStructures)[number]["type"]

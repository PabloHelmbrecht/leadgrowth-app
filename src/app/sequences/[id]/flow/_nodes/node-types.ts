//React Flow
import { type NodeTypes } from "@xyflow/react"

import {
  manualEmailDataSchema,
  ManualEmailNode,
} from "~/app/sequences/[id]/flow/_nodes/manual-email-node"

//Email Data Schema

export const nodeStructures = [
  {
    type: "manualEmail" as const,
    component: ManualEmailNode,
    dataSchema: manualEmailDataSchema,
  },
  {
    type: "placeholder" as const,
    component: ManualEmailNode,
    dataSchema: manualEmailDataSchema,
  },
]

export const nodeTypes: NodeTypes = Object.fromEntries(
  nodeStructures.map((node) => [node.type, node.component]),
)

export const nodeTypesDataSchemas = Object.fromEntries(
  nodeStructures.map((node) => [node.type, node.dataSchema]),
)

export type NodeType = (typeof nodeStructures)[number]["type"]

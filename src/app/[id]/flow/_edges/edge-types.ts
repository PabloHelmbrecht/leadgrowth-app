//React Flow
import { type EdgeTypes } from "@xyflow/react"

import {
    customDataSchema,
    CustomEdge,
} from "~/app/[id]/flow/_edges/custom-edge"

export const edgeStructures = [
    {
        type: "custom" as const,
        component: CustomEdge,
        dataSchema: customDataSchema,
    },
    {
        type: "placeholder" as const,
        component: CustomEdge,
        dataSchema: customDataSchema,
    },
]

export const edgeTypes: EdgeTypes = Object.fromEntries(
    edgeStructures.map((edge) => [edge.type, edge.component]),
)

export const edgeTypesDataSchemas = Object.fromEntries(
    edgeStructures.map((edge) => [edge.type, edge.dataSchema]),
)

export type EdgeType = (typeof edgeStructures)[number]["type"]

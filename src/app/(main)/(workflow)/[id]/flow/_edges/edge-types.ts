//React Flow
import { type EdgeTypes } from "@xyflow/react"

import {
    customDataSchema,
    CustomEdge,
} from "~/app/(main)/(workflow)/[id]/flow/_edges/custom-edge"

import { TemporalEdge } from "~/app/(main)/(workflow)/[id]/flow/_edges/temporal-edge"

export const edgeStructures = [
    {
        type: "custom" as const,
        component: CustomEdge,
        dataSchema: customDataSchema,
    },
    {
        type: "temporal" as const,
        //Hacer animado
        component: TemporalEdge,
        dataSchema: customDataSchema,
    },
    {
        type: "placeholder" as const,
        component: CustomEdge,
        dataSchema: customDataSchema,
    },
]

export const edgeTypes = Object.fromEntries(
    edgeStructures.map((edge) => [edge.type, edge.component]),
) as EdgeTypes

export const edgeTypesDataSchemas = Object.fromEntries(
    edgeStructures.map((edge) => [edge.type, edge.dataSchema]),
)

export type EdgeType = (typeof edgeStructures)[number]["type"]

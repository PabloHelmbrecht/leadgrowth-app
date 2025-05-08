//React Flow
import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react"

//Hooks
import { type Edge } from "~/lib/hooks/use-workflows"

export function TemporalEdge({
    sourceX,
    sourceY,
    targetX,
    targetY,

    sourcePosition,
    targetPosition,
    markerEnd,
}: EdgeProps<Edge>) {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    })

    return (
        <BaseEdge
            path={edgePath}
            markerEnd={markerEnd}
            className=" animated !stroke-slate-400 !stroke-2  transition-colors group-[.selected]:!stroke-primary-700"
        />
    )
}

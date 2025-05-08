import {
    type ConnectionLineComponentProps,
    BaseEdge,
    getBezierPath,
} from "@xyflow/react"
import React from "react"

export function ConnectionLine({
    fromX,
    fromY,
    toX,
    toY,
    fromPosition,
    toPosition,
}: ConnectionLineComponentProps) {
    const [edgePath] = getBezierPath({
        sourceX: fromX,
        sourceY: fromY,
        sourcePosition: fromPosition,
        targetX: toX,
        targetY: toY,
        targetPosition: toPosition,
    })
    return (
        <BaseEdge
            path={edgePath}
            className=" !z-0 !stroke-slate-400 !stroke-2 "
        />
    )
}

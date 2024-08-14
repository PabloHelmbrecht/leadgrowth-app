//React
import { useState } from "react"

import React from "react"
import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getBezierPath,
} from "@xyflow/react"

//Icons
import { ClockCountdown, PencilSimple } from "@phosphor-icons/react/dist/ssr"

export function DefaultEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const [isHovered, setIsHovered] = useState<boolean>(false)

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        className=" !stroke-neutral-400 !stroke-2 transition-colors  group-[.selected]:!stroke-primary-700 "
      />
      <EdgeLabelRenderer>
        <div
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan absolute -translate-x-1/2 -translate-y-1/2"
        >
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex items-center gap-1  rounded-md bg-neutral-100 p-2 text-xs font-semibold  transition-colors hover:text-primary-700"
          >
            {isHovered ? (
              <PencilSimple weight="bold" height={14} width={14} />
            ) : (
              <ClockCountdown weight="bold" height={14} width={14} />
            )}
            3 days
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

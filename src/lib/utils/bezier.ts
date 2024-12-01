import { Position } from "@xyflow/react"

function calculateControlOffset(distance: number, curvature: number): number {
  if (distance >= 0) {
    return 0.5 * distance
  }

  return curvature * 25 * Math.sqrt(-distance)
}

function getControlWithCurvature({
  pos,
  x1,
  y1,
  x2,
  y2,
  c,
}: {
  pos: Position
  x1: number
  y1: number
  x2: number
  y2: number
  c: number
}): [number, number] {
  switch (pos) {
    case Position.Left:
      return [x1 - calculateControlOffset(x1 - x2, c), y1]
    case Position.Right:
      return [x1 + calculateControlOffset(x2 - x1, c), y1]
    case Position.Top:
      return [x1, y1 - calculateControlOffset(y1 - y2, c)]
    case Position.Bottom:
      return [x1, y1 + calculateControlOffset(y2 - y1, c)]
  }
}

export function getBezierEdgePosition({
  sourceX,
  sourceY,
  targetX,
  targetY,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
  curvature = 0.25,

  t = 0.5,
}: {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  targetPosition?: Position
  sourcePosition?: Position
  curvature?: number
  t?: number
}): [number, number, number, number] {
  // cubic bezier t=0.5 mid point, not the actual mid point, but easy to calculate
  // https://stackoverflow.com/questions/67516101/how-to-find-distance-mid-point-of-bezier-curve

  const [sourceControlX, sourceControlY] = getControlWithCurvature({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
    c: curvature,
  })
  const [targetControlX, targetControlY] = getControlWithCurvature({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
    c: curvature,
  })

  const centerX =
    sourceX * (1 - t) ** 3 +
    sourceControlX * 3 * t * (1 - t) ** 2 +
    targetControlX * 3 * t ** 2 * (1 - t) +
    targetX * t ** 3
  const centerY =
    sourceY * (1 - t) ** 3 +
    sourceControlY * 3 * t * (1 - t) ** 2 +
    targetControlY * 3 * t ** 2 * (1 - t) +
    targetY * t ** 3
  const offsetX = Math.abs(centerX - sourceX)
  const offsetY = Math.abs(centerY - sourceY)

  return [centerX, centerY, offsetX, offsetY]
}

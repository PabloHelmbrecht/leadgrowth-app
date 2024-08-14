"use client"

//React
import { useState, useCallback, type DragEventHandler } from "react"

//Utils
import { makeId, getPercentage } from "~/lib/utils"

//Icons
import { Sparkle } from "@phosphor-icons/react/dist/ssr"

//UI
import { KPI } from "~/components/ui/kpi"

//Dagre
import Dagre from "@dagrejs/dagre"

//React Flow
import {
  type Node,
  type Edge,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type OnNodeDrag,
  type DefaultEdgeOptions,
  type InternalNode,
  type IsValidConnection,
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  useStoreApi,
  useReactFlow,
  getOutgoers,
  Panel,
  ControlButton,
} from "@xyflow/react"

//NodeTypes
import { nodeTypes } from "./_nodes/node-types"

//EdgeTypes
import { edgeTypes } from "./_edges/edge-types"

//Connection Line
import { ConnectionLine } from "./_connection-line/connection-line"

//Mock Data
const initialNodes = [
  {
    id: "1",
    type: "custom",
    className: "group",
    data: { label: "Node 1" },
    position: { x: 0, y: 50 },
  },
  {
    id: "2",
    type: "custom",
    className: "group",
    data: { label: "Node 2" },

    position: { x: -400, y: 400 },
  },
  {
    id: "3",
    type: "custom",
    className: "group",
    data: { label: "Node 3" },
    position: { x: 400, y: 400 },
  },
]

const initialEdges: Edge[] = [
  {
    id: "1-2",
    source: "1",
    target: "2",
    type: "custom",
    className: "group",
    sourceHandle: "default",
  },
]

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: false,
}

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 200 })

  edges.forEach((edge) => g.setEdge(edge.source, edge.target))
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    }),
  )

  Dagre.layout(g)

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id)
      const x = position.x - (node.measured?.width ?? 0) / 2
      const y = position.y - (node.measured?.height ?? 0) / 2

      return { ...node, position: { x, y } }
    }),
    edges,
  }
}

export default function SequenceFlowPage() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const store = useStoreApi()
  const { getInternalNode, getNodes, getEdges, screenToFlowPosition, fitView } =
    useReactFlow()

  const isValidConnection: IsValidConnection = useCallback(
    (connection) => {
      // we are using getNodes and getEdges helpers here
      // to make sure we create isValidConnection function only once

      const nodes = getNodes()
      const edges = getEdges()
      const target = nodes.find((node) => node.id === connection.target)
      if (!target) return false
      const hasCycle = (node: Node, visited = new Set()) => {
        if (visited.has(node.id)) return false

        visited.add(node.id)

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true
          if (hasCycle(outgoer, visited)) return true
        }
      }

      if (target.id === connection.source) return false
      return !hasCycle(target)
    },
    [getNodes, getEdges],
  )

  const getClosestEdge = useCallback(
    (node: Node): Edge | null => {
      const { nodeLookup } = store.getState()
      const internalNode = getInternalNode(node.id)
      const MIN_DISTANCE = 400
      const edges = getEdges()

      if (!internalNode) return null

      const closestNode = Array.from(nodeLookup.values()).reduce(
        (
          res: {
            distance: number
            node: InternalNode | null
            sourceHandle: string | null
          },
          n,
        ) => {
          if (n.id !== internalNode.id) {
            const dx =
              n.internals.positionAbsolute.x -
              internalNode.internals.positionAbsolute.x
            const dy =
              n.internals.positionAbsolute.y -
              internalNode.internals.positionAbsolute.y
            const d = Math.sqrt(dx * dx + dy * dy)

            const closeNodeIsSource = dy > 0

            const sourceNode = !closeNodeIsSource ? n : internalNode
            const targetNode = closeNodeIsSource ? n : internalNode
            const posibleSourceHandles =
              sourceNode.internals.handleBounds?.source?.filter(
                (handle) =>
                  !edges.find(
                    (edge) =>
                      edge.sourceHandle === handle.id &&
                      edge.source === sourceNode.id &&
                      edge.target !== targetNode.id,
                  ),
              )

            if (
              d < res.distance &&
              d < MIN_DISTANCE &&
              posibleSourceHandles &&
              posibleSourceHandles?.length > 0
            ) {
              res.distance = d
              res.node = n
              res.sourceHandle = posibleSourceHandles.shift()?.id ?? null
            }
          }

          return res
        },
        {
          distance: Number.MAX_VALUE,
          node: null,
          sourceHandle: null,
        },
      )

      if (!closestNode.node) {
        return null
      }

      const closeNodeIsSource =
        closestNode.node.internals.positionAbsolute.y <
        internalNode.internals.positionAbsolute.y

      return {
        id: closeNodeIsSource
          ? `${closestNode.node.id}-${node.id}`
          : `${node.id}-${closestNode.node.id}`,
        source: closeNodeIsSource ? closestNode.node.id : node.id,
        target: closeNodeIsSource ? node.id : closestNode.node.id,
        sourceHandle: closestNode.sourceHandle,
        targetHandle: null,
      }
    },
    [getInternalNode, store, getEdges],
  )

  const onLayout = useCallback(() => {
    const layouted = getLayoutedElements(nodes, edges)

    setNodes([...layouted.nodes])
    setEdges([...layouted.edges])

    window.requestAnimationFrame(() => {
      void fitView({ padding: 5 })
    })
  }, [nodes, edges, fitView])

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  )
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  )
  const onConnect: OnConnect = useCallback(
    (connection) =>
      setEdges((eds) =>
        addEdge({ ...connection, type: "custom", className: "group" }, eds),
      ),
    [setEdges],
  )

  const onDragOver: DragEventHandler = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop: DragEventHandler = useCallback(
    (event) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow")

      if (typeof type === "undefined" || !type) {
        return
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      //Ajusto para el tamaño del nodo (TASK hacer esto dinámico)
      position.x = position.x - 384 / 2
      position.y = position.y - 196 / 2

      const newNode = {
        id: makeId(2),
        type,
        position,
        data: { label: `${type} node` },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [screenToFlowPosition],
  )

  const onNodeDrag: OnNodeDrag = useCallback(
    (_, node) => {
      const closeEdge = getClosestEdge(node)

      setEdges((es) => {
        const nextEdges = es.filter((e) => !e.className?.includes("temp"))

        if (
          closeEdge &&
          !nextEdges.find(
            (ne) =>
              ne.source === closeEdge.source && ne.target === closeEdge.target,
          )
        ) {
          closeEdge.type = "custom"
          closeEdge.className = "temp group"
          closeEdge.animated = true
          if (isValidConnection(closeEdge)) {
            nextEdges.push(closeEdge)
          }
        }

        return nextEdges
      })
    },
    [getClosestEdge, setEdges, isValidConnection],
  )

  const onNodeDragStop: OnNodeDrag = useCallback(
    (_, node) => {
      const closeEdge = getClosestEdge(node)

      setEdges((es) => {
        const nextEdges = es.filter((e) => !e.className?.includes("temp"))

        if (
          closeEdge &&
          !nextEdges.find(
            (ne) =>
              ne.source === closeEdge.source && ne.target === closeEdge.target,
          )
        ) {
          closeEdge.type = "custom"
          closeEdge.className = "group"
          closeEdge.animated = false

          if (isValidConnection(closeEdge)) {
            nextEdges.push(closeEdge)
          }
        }

        return nextEdges
      })
    },
    [getClosestEdge, isValidConnection],
  )

  return (
    <main className="flex h-full w-full flex-1 flex-col justify-end">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onDragOver={onDragOver}
        onDrop={onDrop}
        connectionLineComponent={ConnectionLine}
        isValidConnection={isValidConnection}
        fitView
        defaultEdgeOptions={defaultEdgeOptions}
      >
        <Background />
        <Controls>
          <ControlButton
            onClick={() => onLayout()}
            aria-label="order flow"
            title="order flow"
          >
            <Sparkle weight="fill" />
          </ControlButton>
        </Controls>
        <Panel position="top-center" className="flex gap-3">
          {FlowPanel}
        </Panel>
      </ReactFlow>
    </main>
  )
}

const FlowPanel = (
  <div className="flex !w-[59rem] items-center justify-center gap-6">
    <div className="flex items-center justify-center gap-4 rounded-md border border-neutral-200 bg-white px-4 py-2 drop-shadow-sm">
      <KPI
        value={getPercentage("20", "100")}
        onHoverValue={"20"}
        label="Active"
      />
      <KPI
        value={getPercentage("20", "100")}
        onHoverValue={"20"}
        label="Paused"
      />
      <KPI
        value={getPercentage("20", "100")}
        onHoverValue={"20"}
        label="Finished"
      />
    </div>

    <div className="flex items-center justify-center gap-4 rounded-md border border-neutral-200 bg-white px-4  py-2 drop-shadow-sm">
      <KPI
        value={getPercentage("20", "100")}
        onHoverValue={"20"}
        label="Spam"
      />
      <KPI
        value={getPercentage("20", "100")}
        onHoverValue={"20"}
        label="Bounced"
      />
      <KPI
        value={getPercentage("20", "100")}
        onHoverValue={"20"}
        label="Unsubscribed"
      />
    </div>
    <div className="flex items-center justify-center gap-4 rounded-md border border-neutral-200 bg-white px-4  py-2 drop-shadow-sm">
      <KPI
        value={getPercentage("20", "100")}
        onHoverValue={"20"}
        label="Opens"
      />
      <KPI
        value={getPercentage("20", "100")}
        onHoverValue={"20"}
        label="Replies"
      />
      <KPI
        value={getPercentage("20", "100")}
        onHoverValue={"20"}
        label="Clicks"
      />
      <KPI
        value={getPercentage("20", "100")}
        onHoverValue={"20"}
        label="Interested"
      />
      <KPI
        value={getPercentage("20", "100")}
        onHoverValue={"20"}
        label="Not Interested"
      />
    </div>
  </div>
)

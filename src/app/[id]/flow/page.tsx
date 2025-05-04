"use client"

//React
import { useCallback, type DragEventHandler, useEffect, useState } from "react"

//Env Variables
import { env } from "~/env"

//Next JS
import { useParams } from "next/navigation"

//Utils
import { getPercentage } from "~/lib/utils/formatters"

//Icons
import { Sparkle, CircleNotch } from "@phosphor-icons/react/dist/ssr"

//UI
import { KPI } from "~/components/ui/kpi"

//Dagre
import Dagre from "@dagrejs/dagre"

//React Flow
import {
    type OnConnect,
    type OnNodesChange,
    type OnEdgesChange,
    type OnNodeDrag,
    type DefaultEdgeOptions,
    type InternalNode,
    type IsValidConnection,
    type NodeChange,
    type EdgeChange,
    ReactFlow,
    Background,
    Controls,
    useStoreApi,
    useReactFlow,
    getOutgoers,
    Panel,
    ControlButton,
    useKeyPress,
} from "@xyflow/react"

//NodeTypes
import { nodeTypes } from "./_nodes/node-types"

//EdgeTypes
import { edgeTypes } from "./_edges/edge-types"

//Connection Line
import { ConnectionLine } from "./_connection-line/connection-line"

//Hooks
import { useWorkflows, type Edge, type Node } from "~/lib/hooks/use-workflows"
import type { TablesInsert, Json } from "~/lib/supabase/database.types"
import { useMousePosition } from "~/lib/hooks/use-mouse-position"

//Tanstack Pacer
import { debounce } from "@tanstack/pacer"

//Jotai & Atoms
import { copyPasteFlowAtom } from "~/lib/stores/copy-paste-flow"
import { useAtom } from "jotai"

const defaultEdgeOptions: DefaultEdgeOptions = {
    animated: false,
}

export default function WorkflowFlowPage() {
    const { id: workflowId } = useParams<{ id: string }>()
    const shiftPressed = useKeyPress("Shift")
    const escapePressed = useKeyPress("Escape")
    const deletePressed = useKeyPress("Delete")
    const backspacePressed = useKeyPress("Backspace")
    const copyPressed = useKeyPress("Control+c")
    const pastePressed = useKeyPress("Control+v")
    const [allowPaste, setAllowPaste] = useState(false)

    const {
        data: workflow,
        isLoading,
        isError,
        createNode,
        createEdge,
        updateNodes,
        updateEdges,
        deleteNode,
        moveNode,
        deleteEdge,
        setSelections,
        clearSelections,
    } = useWorkflows({ workflowId })

    const { nodes, edges } = workflow?.[0]?.flow ?? { nodes: [], edges: [] }

    const [copyPasteFlow, setCopyPasteFlow] = useAtom(copyPasteFlowAtom)

    const { x, y } = useMousePosition()

    const store = useStoreApi()

    const {
        getInternalNode,
        getNodes,
        getEdges,
        screenToFlowPosition,
        fitView,
    } = useReactFlow()

    useEffect(() => {
        if (copyPressed) {
            setCopyPasteFlow({
                nodes: nodes.filter((node) => node.selected),
                edges: edges.filter((edge) => edge.selected),
            })
        }
    }, [copyPressed, nodes, edges, setCopyPasteFlow])

    useEffect(() => {
        if (!pastePressed) {
            setAllowPaste(true)
        }

        if (pastePressed && allowPaste) {
            debounce(
                () => {
                    const mousePosition = screenToFlowPosition({ x, y })
                    // 1. Obtener la posición del mouse en el flujo

                    const { nodes: copiedNodes } = copyPasteFlow

                    if (copiedNodes && copiedNodes.length > 0) {
                        // 2. Encontrar el nodo de referencia (más arriba a la izquierda)
                        const minX = Math.min(
                            ...copiedNodes.map((n) => n.position.x),
                        )
                        const minY = Math.min(
                            ...copiedNodes.map((n) => n.position.y),
                        )

                        // 3. Calcular nuevas posiciones relativas y sumarlas a la posición del mouse
                        copiedNodes.forEach((node) => {
                            const { id: _, ...rest } = node
                            void createNode({
                                node: {
                                    ...rest,
                                    type: node.type ?? "placeholder",
                                    data: JSON.parse(
                                        JSON.stringify(node.data),
                                    ) as Record<string, unknown>,
                                    position: {
                                        x:
                                            mousePosition.x +
                                            (node.position.x - minX),
                                        y:
                                            mousePosition.y +
                                            (node.position.y - minY),
                                    },
                                },
                            })
                        })
                    }
                },
                { wait: 300 },
            )()

            setAllowPaste(false)
        }
    }, [
        pastePressed,
        nodes,
        edges,
        copyPasteFlow,
        createNode,
        x,
        y,
        screenToFlowPosition,
        allowPaste,
    ])

    useEffect(() => {
        if (deletePressed || backspacePressed) {
            edges.forEach((edge) => {
                if (edge.selected && edge.deletable) {
                    void deleteEdge({
                        sourceId: edge.source,
                        targetId: edge.target,
                    })
                }
            })

            nodes.forEach((node) => {
                if (node.selected && node.deletable) {
                    void deleteNode({
                        nodeId: node.id,
                    })
                }
            })
        }
    }, [deletePressed, backspacePressed, deleteNode, deleteEdge, nodes, edges])

    useEffect(() => {
        if (escapePressed) {
            clearSelections({})
        }
    }, [escapePressed, clearSelections])

    const getLayoutedElements = (
        nodes: Node[],
        edges: Edge[],
    ): { nodes: Node[]; edges: Edge[] } => {
        const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
        g.setGraph({ rankdir: "TB", nodesep: 800, ranksep: 700 })

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

    const isValidConnection: IsValidConnection = useCallback(
        (connection) => {
            const nodes = getNodes()
            const edges = getEdges()
            const target = nodes.find((node) => node.id === connection.target)
            if (!target) return false
            const hasCycle = (node: Node, visited = new Set()) => {
                if (visited.has(node.id)) return false

                visited.add(node.id)

                for (const outgoer of getOutgoers(node, nodes, edges)) {
                    if (outgoer.id === connection.source) return true
                    if (hasCycle(outgoer as Node, visited)) return true
                }
            }

            if (target.id === connection.source) return false
            if (
                edges.some(
                    (edge) =>
                        edge.id === `${connection.source}-${connection.target}`,
                )
            ) {
                return false
            }
            return !hasCycle(target as Node)
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
                        let dy =
                            n.internals.positionAbsolute.y -
                            internalNode.internals.positionAbsolute.y

                        const closeNodeIsSource = dy > 0

                        //Translation of absolute position to handle theorical position
                        if (closeNodeIsSource) {
                            dy = dy - (internalNode?.measured?.height ?? 0)
                        } else {
                            dy = dy + (n?.measured?.height ?? 0)
                        }

                        const d = Math.sqrt(dx * dx + dy * dy)

                        const sourceNode = !closeNodeIsSource ? n : internalNode
                        const targetNode = closeNodeIsSource ? n : internalNode
                        const posibleSourceHandles =
                            sourceNode.internals.handleBounds?.source?.filter(
                                (handle) =>
                                    !env.NEXT_PUBLIC_SINGLE_CONNECTION_MODE ||
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
                            posibleSourceHandles?.length > 0 &&
                            targetNode.type !== "trigger"
                        ) {
                            res.distance = d
                            res.node = n
                            res.sourceHandle =
                                posibleSourceHandles.shift()?.id ?? null
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

            const edge: Edge = {
                id: `${closeNodeIsSource ? closestNode.node.id : node.id}-${closeNodeIsSource ? node.id : closestNode.node.id}`,
                source: closeNodeIsSource ? closestNode.node.id : node.id,
                target: closeNodeIsSource ? node.id : closestNode.node.id,
                sourceHandle: closestNode.sourceHandle,
                targetHandle: null,
                className: "group",
                animated: true,
                deletable: true,
                selected: false,
                data: {
                    delay: 1,
                    unit: "days",
                    order: 1,
                },
                type: "custom",
            }

            return edge
        },
        [getInternalNode, store, getEdges],
    )

    const onLayout = useCallback(() => {
        const layouted = getLayoutedElements(nodes, edges)

        layouted.nodes.forEach((node) => {
            void moveNode({
                nodeId: node.id,
                position: {
                    x: node.position.x,
                    y: node.position.y,
                },
            })
        })

        window.requestAnimationFrame(() => {
            void fitView({ padding: 5 })
        })
    }, [nodes, edges, fitView, moveNode])

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => {
            changes.forEach((change: NodeChange) => {
                if (change.type === "add") {
                    void createNode({
                        node: {
                            ...change.item,
                            data: change.item.data as Record<string, unknown> &
                                Json,
                            type: change.item
                                .type as TablesInsert<"nodes">["type"],
                        },
                    })
                }

                if (change.type === "remove") {
                    void deleteNode({
                        nodeId: change.id,
                    })
                }

                if (
                    change.type === "position" &&
                    change.position &&
                    !isNaN(change.position.x) &&
                    !isNaN(change.position.y)
                ) {
                    void moveNode({
                        nodeId: change.id,
                        position: change.position,
                    })
                }

                if (change.type === "replace") {
                    const originalNode = nodes.find((n) => n.id === change.id)
                    if (originalNode) {
                        const updatedNode = {
                            ...originalNode,
                            ...change.item,
                        } as Node
                        void updateNodes({ nodes: [updatedNode] })
                    }
                }

                if (change.type === "select") {
                    if (!shiftPressed) {
                        clearSelections({})
                    }

                    setSelections({
                        nodes: nodes.filter((node) => node.id === change.id),
                    })
                }
            })
        },
        [
            nodes,
            updateNodes,
            createNode,
            deleteNode,
            moveNode,
            setSelections,
            clearSelections,
            shiftPressed,
        ],
    )

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => {
            changes.forEach((change: EdgeChange) => {
                if (change.type === "add") {
                    void createEdge({
                        edge: {
                            ...change.item,
                            type: (change.item.type ??
                                "custom") as Edge["type"],
                            data: {
                                delay: 0,
                                unit: "days",
                                order: 1,
                                ...(change.item.data ?? {}),
                            },
                        },
                    })
                }

                if (change.type === "remove") {
                    void deleteEdge({
                        sourceId: change.id,
                        targetId: change.id,
                    })
                }
                if (change.type === "replace") {
                    void updateEdges({
                        edges: [
                            {
                                ...change.item,
                                type: (change.item.type ??
                                    "custom") as Edge["type"],
                                data: {
                                    delay: 1,
                                    unit: "days",
                                    order: 1,
                                    ...(change.item.data ?? {}),
                                },
                            },
                        ],
                    })
                }
                if (change.type === "select") {
                    if (!shiftPressed) {
                        clearSelections({})
                    }

                    setSelections({
                        edges: edges.filter((edge) => edge.id === change.id),
                    })
                }
            })
        },
        [
            edges,
            createEdge,
            deleteEdge,
            updateEdges,
            setSelections,
            clearSelections,
            shiftPressed,
        ],
    )

    const onConnect: OnConnect = useCallback(
        (connection) => {
            const edges = store.getState().edges

            if (
                edges.find(
                    (edge) =>
                        edge.id === `${connection.source}-${connection.target}`,
                )
            ) {
                return
            }

            void createEdge({
                edge: {
                    ...connection,
                    id: `${connection.source}-${connection.target}`,
                    type: "custom",
                    data: {
                        delay: 1,
                        unit: "days",
                        order: 1,
                    },
                },
            })
        },
        [createEdge, store],
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

            void createNode({
                node: {
                    type: type as TablesInsert<"nodes">["type"],
                    position,
                    data: { label: `${type} node` },
                },
            })
        },
        [screenToFlowPosition, createNode],
    )

    const onNodeDrag: OnNodeDrag = useCallback(
        (_, node) => {
            const closeEdge = getClosestEdge({
                ...node,
                type: node.type,
            } as Node)

            const temporalEdges = edges.filter(
                (edge) => edge.type === "temporal",
            )

            temporalEdges.forEach((edge) => {
                if (
                    !(
                        edge.source === closeEdge?.source &&
                        edge.target === closeEdge?.target
                    )
                ) {
                    void deleteEdge({
                        sourceId: edge.source,
                        targetId: edge.target,
                    })
                }
            })

            if (
                closeEdge &&
                !edges.some(
                    (edge) =>
                        edge.source === closeEdge.source &&
                        edge.target === closeEdge.target,
                ) &&
                isValidConnection(closeEdge)
            ) {
                void createEdge({
                    edge: {
                        ...closeEdge,
                        type: "temporal",
                    },
                })
            }
        },
        [getClosestEdge, isValidConnection, createEdge, edges, deleteEdge],
    )

    const onNodeDragStop: OnNodeDrag = useCallback(
        (_, node) => {
            const closeEdge = getClosestEdge(node as Node)

            if (closeEdge && isValidConnection(closeEdge)) {
                const temporalEdge = edges.find(
                    (edge) =>
                        edge.source === closeEdge.source &&
                        edge.target === closeEdge.target,
                )

                if (temporalEdge) {
                    temporalEdge.type = "custom"
                    void updateEdges({
                        edges: [temporalEdge],
                    })
                }
            }
        },
        [getClosestEdge, isValidConnection, updateEdges, edges],
    )

    if (isLoading || isError)
        return (
            <div className="flex h-full w-full flex-row items-center justify-center gap-2">
                <CircleNotch
                    className="animate-spin text-primary-700"
                    weight="bold"
                    width={20}
                    height={20}
                />
                Loading...
            </div>
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

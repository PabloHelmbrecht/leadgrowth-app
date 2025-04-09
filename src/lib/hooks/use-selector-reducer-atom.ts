//React
import { useCallback, useMemo } from "react"

//Jotai
import { useAtom, type PrimitiveAtom } from "jotai"

//Zod
import { z } from "zod"

//Tan Stack
import type { ColumnFiltersState } from "@tanstack/react-table"

//Types
import { type Workflow } from "~/lib/stores/mockData/workflow"
import { type Node, type Edge } from "~/lib/stores/mockData/flow"

//Selector and Reducer Atom Helper Functions

/**
 * Hook para seleccionar y despachar acciones en un atom de Jotai.
 * @template Value - Tipo del valor del atom.
 * @template Action - Tipo de las acciones que se pueden despachar.
 * @template SelectorValue - Tipo del valor seleccionado.
 * @param {PrimitiveAtom<Value>} anAtom - El atom de Jotai.
 * @param {Object} selectorReducer - Objeto que contiene el selector y el reducer.
 * @param {Function} selectorReducer.selector - Función que selecciona un valor del estado.
 * @param {Function} selectorReducer.reducer - Función que reduce el estado con una acción.
 * @returns {[SelectorValue, Function]} - Retorna el valor seleccionado y la función dispatch.
 */
export function useSelectorReducerAtom<Value, Action, SelectorValue>(
    anAtom: PrimitiveAtom<Value>,
    selectorReducer: {
        selector: (v: Value) => SelectorValue
        reducer: (v: Value, a: Action) => Value
    },
) {
    const { selector, reducer } = selectorReducer
    const [state, setState] = useAtom(anAtom)
    const applySelector = useMemo(() => selector(state), [state, selector])
    const dispatch = useCallback(
        (action: Action) => setState((prev) => reducer(prev, action)),
        [setState, reducer],
    )
    return [applySelector, dispatch] as const
}

/**
 * Crea un selector y un reducer para filtrar columnas.
 * @param {string} columnId - El ID de la columna.
 * @returns {Object} - Objeto que contiene el selector y el reducer.
 */
export function columnFilterSelectorReducer(columnId: string) {
    const selector = (prev: ColumnFiltersState): string[] =>
        z
            .array(
                z.object({
                    id: z.string(),
                    value: z.array(z.string()),
                }),
            )
            .parse(prev)
            .find((columnFilter) => columnFilter?.id === columnId)?.value ?? []
    const reducer = (prev: ColumnFiltersState, value: string[]) => [
        ...prev.filter(({ id }) => id !== columnId),
        { id: columnId, value },
    ]
    return { selector, reducer }
}

/**
 * Crea un selector y un reducer para una unico elemento.
 * @param {string} id - El ID del elemento.
 * @returns {Object} - Objeto que contiene el selector y el reducer.
 */
export function uniqueSelectorReducer<Entity extends { id: string }>(
    id: string,
) {
    const selector = (prev: Entity[]): Entity | null =>
        prev.find((item) => item?.id === id) ?? null
    const reducer = (
        prev: Entity[],
        action: Entity | ((entity: Entity) => Entity),
    ) => {
        const newEntity =
            typeof action === "function"
                ? action(prev.find((item) => item.id === id)!)
                : action

        if (prev.some((item) => item.id === id)) {
            return prev.map((item) => (item.id === id ? newEntity : item))
        }

        return [...prev.filter((item) => item.id !== id), newEntity]
    }
    return { selector, reducer }
}

/**
 * Crea un selector y un reducer para nodos en una secuencia.
 * @param {string} workflowId - El ID de la secuencia.
 * @returns {Object} - Objeto que contiene el selector y el reducer.
 */
export function nodeSelectorReducer(workflowId: string) {
    const selector = (workflows: Workflow[]): Node[] => {
        const foundWorkflow = workflows.find(({ id }) => workflowId === id)
        if (!foundWorkflow) return []
        const nodes = foundWorkflow.flow.nodes
        return nodes
    }

    const reducer = (
        workflows: Workflow[],
        newNodes: Node[] | ((nodes: Node[]) => Node[]),
    ): Workflow[] => {
        const foundWorkflow = workflows.find(({ id }) => workflowId === id)
        if (!foundWorkflow) return workflows
        foundWorkflow.flow.nodes =
            typeof newNodes === "function"
                ? newNodes(foundWorkflow.flow.nodes)
                : newNodes
        const newWorkflows = workflows.map((workflow) =>
            workflow.id === foundWorkflow.id ? foundWorkflow : workflow,
        )

        return newWorkflows
    }
    return { selector, reducer }
}

/**
 * Crea un selector y un reducer para aristas en una secuencia.
 * @param {string} workflowId - El ID de la secuencia.
 * @returns {Object} - Objeto que contiene el selector y el reducer.
 */
export function edgeSelectorReducer(workflowId: string) {
    const selector = (workflows: Workflow[]): Edge[] => {
        const foundWorkflow = workflows.find(({ id }) => workflowId === id)
        if (!foundWorkflow) return []
        const edges = foundWorkflow.flow.edges
        return edges
    }

    const reducer = (
        workflows: Workflow[],
        newEdges: Edge[] | ((edges: Edge[]) => Edge[]),
    ): Workflow[] => {
        const foundWorkflow = workflows.find(({ id }) => workflowId === id)
        if (!foundWorkflow) return workflows

        foundWorkflow.flow.edges =
            typeof newEdges === "function"
                ? newEdges(foundWorkflow.flow.edges)
                : newEdges
        const newWorkflows = workflows.map((workflow) =>
            workflow.id === foundWorkflow.id ? foundWorkflow : workflow,
        )
        return newWorkflows
    }
    return { selector, reducer }
}

/**
 * Crea un selector y un reducer para un nodo único en una secuencia.
 * @param {string} workflowId - El ID de la secuencia.
 * @param {string} nodeId - El ID del nodo.
 * @returns {Object} - Objeto que contiene el selector y el reducer.
 */
export function uniqueNodeSelectorReducer(workflowId: string, nodeId: string) {
    const selector = (workflows: Workflow[]): Node | null => {
        const foundWorkflow = workflows.find(({ id }) => workflowId === id)
        if (!foundWorkflow) {
            return null
            // throw new Error(`Workflow Id ${workflowId} is not valid.`)
        }
        const foundNode = foundWorkflow.flow.nodes.find(
            ({ id }) => nodeId === id,
        )
        if (!foundNode) {
            return null
            // throw new Error(`Node Id ${nodeId} is not valid.`)
        }
        return foundNode
    }

    const reducer = (
        workflows: Workflow[],
        newNode: Node | ((nodes: Node) => Node),
    ): Workflow[] => {
        const foundWorkflow = workflows.find(({ id }) => workflowId === id)
        if (!foundWorkflow) {
            return workflows
            // throw new Error(`Workflow Id ${workflowId} is not valid.`)
        }

        const foundNode = foundWorkflow.flow.nodes.find(
            ({ id }) => nodeId === id,
        )
        if (!foundNode) {
            return workflows
            // throw new Error(`Node Id ${nodeId} is not valid.`)
        }

        const newWorkflows = workflows.map((workflow) => {
            if (workflow.id !== foundWorkflow.id) return workflow

            workflow.flow.nodes = workflow.flow.nodes.map((node) => {
                if (node.id !== foundNode.id) return node

                return typeof newNode === "function"
                    ? newNode(foundNode)
                    : newNode
            })

            return workflow
        })

        return newWorkflows
    }
    return { selector, reducer }
}

/**
 * Crea un selector y un reducer para una arista única en una secuencia.
 * @param {string} workflowId - El ID de la secuencia.
 * @param {string} edgeId - El ID de la arista.
 * @returns {Object} - Objeto que contiene el selector y el reducer.
 */
export function uniqueEdgeSelectorReducer(workflowId: string, edgeId: string) {
    const selector = (workflows: Workflow[]): Edge | null => {
        const foundWorkflow = workflows.find(({ id }) => workflowId === id)
        if (!foundWorkflow)
            throw new Error(`Workflow Id ${workflowId} is not valid.`)
        const foundEdge = foundWorkflow.flow.edges.find(
            ({ id }) => edgeId === id,
        )
        if (!foundEdge) {
            return null
            // throw new Error(`Edge Id ${edgeId} is not valid.`)
        }
        return foundEdge
    }

    const reducer = (
        workflows: Workflow[],
        newEdge: Edge | ((edge: Edge) => Edge),
    ): Workflow[] => {
        const foundWorkflow = workflows.find(({ id }) => workflowId === id)
        if (!foundWorkflow)
            throw new Error(`Workflow Id ${workflowId} is not valid.`)

        const foundEdge = foundWorkflow.flow.edges.find(
            ({ id }) => edgeId === id,
        )
        if (!foundEdge) {
            return workflows
            // throw new Error(`Edge Id ${edgeId} is not valid.`)
        }
        const newWorkflows = workflows.map((workflow) => {
            if (workflow.id !== foundWorkflow.id) return workflow

            workflow.flow.edges = workflow.flow.edges.map((edge) => {
                if (edge.id !== foundEdge.id) return edge

                return typeof newEdge === "function"
                    ? newEdge(foundEdge)
                    : newEdge
            })

            return workflow
        })

        return newWorkflows
    }
    return { selector, reducer }
}

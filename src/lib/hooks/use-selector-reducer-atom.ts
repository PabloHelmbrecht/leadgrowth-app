//React
import { useCallback, useMemo } from "react"

//Jotai
import { useAtom, type PrimitiveAtom } from "jotai"

//Zod
import { z } from "zod"

//Tan Stack
import type { ColumnFiltersState } from "@tanstack/react-table"

//Types
import { type Sequence } from "~/lib/stores/mockData/sequence"
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
 * Crea un selector y un reducer para nodos en una secuencia.
 * @param {string} sequenceId - El ID de la secuencia.
 * @returns {Object} - Objeto que contiene el selector y el reducer.
 */
export function nodeSelectorReducer(sequenceId: string) {
    const selector = (sequences: Sequence[]): Node[] => {
        const foundSequence = sequences.find(({ id }) => sequenceId === id)
        if (!foundSequence) return []
        const nodes = foundSequence.flow.nodes
        return nodes
    }

    const reducer = (
        sequences: Sequence[],
        newNodes: Node[] | ((nodes: Node[]) => Node[]),
    ): Sequence[] => {
        const foundSequence = sequences.find(({ id }) => sequenceId === id)
        if (!foundSequence) return sequences
        foundSequence.flow.nodes =
            typeof newNodes === "function"
                ? newNodes(foundSequence.flow.nodes)
                : newNodes
        const newSequences = sequences.map((sequence) =>
            sequence.id === foundSequence.id ? foundSequence : sequence,
        )

        return newSequences
    }
    return { selector, reducer }
}

/**
 * Crea un selector y un reducer para aristas en una secuencia.
 * @param {string} sequenceId - El ID de la secuencia.
 * @returns {Object} - Objeto que contiene el selector y el reducer.
 */
export function edgeSelectorReducer(sequenceId: string) {
    const selector = (sequences: Sequence[]): Edge[] => {
        const foundSequence = sequences.find(({ id }) => sequenceId === id)
        if (!foundSequence) return []
        const edges = foundSequence.flow.edges
        return edges
    }

    const reducer = (
        sequences: Sequence[],
        newEdges: Edge[] | ((edges: Edge[]) => Edge[]),
    ): Sequence[] => {
        const foundSequence = sequences.find(({ id }) => sequenceId === id)
        if (!foundSequence) return sequences

        foundSequence.flow.edges =
            typeof newEdges === "function"
                ? newEdges(foundSequence.flow.edges)
                : newEdges
        const newSequences = sequences.map((sequence) =>
            sequence.id === foundSequence.id ? foundSequence : sequence,
        )
        return newSequences
    }
    return { selector, reducer }
}

/**
 * Crea un selector y un reducer para un nodo único en una secuencia.
 * @param {string} sequenceId - El ID de la secuencia.
 * @param {string} nodeId - El ID del nodo.
 * @returns {Object} - Objeto que contiene el selector y el reducer.
 */
export function uniqueNodeSelectorReducer(sequenceId: string, nodeId: string) {
    const selector = (sequences: Sequence[]): Node | null => {
        const foundSequence = sequences.find(({ id }) => sequenceId === id)
        if (!foundSequence) {
            return null
            // throw new Error(`Sequence Id ${sequenceId} is not valid.`)
        }
        const foundNode = foundSequence.flow.nodes.find(
            ({ id }) => nodeId === id,
        )
        if (!foundNode) {
            return null
            // throw new Error(`Node Id ${nodeId} is not valid.`)
        }
        return foundNode
    }

    const reducer = (
        sequences: Sequence[],
        newNode: Node | ((nodes: Node) => Node),
    ): Sequence[] => {
        const foundSequence = sequences.find(({ id }) => sequenceId === id)
        if (!foundSequence) {
            return sequences
            // throw new Error(`Sequence Id ${sequenceId} is not valid.`)
        }

        const foundNode = foundSequence.flow.nodes.find(
            ({ id }) => nodeId === id,
        )
        if (!foundNode) {
            return sequences
            // throw new Error(`Node Id ${nodeId} is not valid.`)
        }

        const newSequences = sequences.map((sequence) => {
            if (sequence.id !== foundSequence.id) return sequence

            sequence.flow.nodes = sequence.flow.nodes.map((node) => {
                if (node.id !== foundNode.id) return node

                return typeof newNode === "function"
                    ? newNode(foundNode)
                    : newNode
            })

            return sequence
        })

        return newSequences
    }
    return { selector, reducer }
}

/**
 * Crea un selector y un reducer para una arista única en una secuencia.
 * @param {string} sequenceId - El ID de la secuencia.
 * @param {string} edgeId - El ID de la arista.
 * @returns {Object} - Objeto que contiene el selector y el reducer.
 */
export function uniqueEdgeSelectorReducer(sequenceId: string, edgeId: string) {
    const selector = (sequences: Sequence[]): Edge | null => {
        const foundSequence = sequences.find(({ id }) => sequenceId === id)
        if (!foundSequence)
            throw new Error(`Sequence Id ${sequenceId} is not valid.`)
        const foundEdge = foundSequence.flow.edges.find(
            ({ id }) => edgeId === id,
        )
        if (!foundEdge) {
            return null
            // throw new Error(`Edge Id ${edgeId} is not valid.`)
        }
        return foundEdge
    }

    const reducer = (
        sequences: Sequence[],
        newEdge: Edge | ((edge: Edge) => Edge),
    ): Sequence[] => {
        const foundSequence = sequences.find(({ id }) => sequenceId === id)
        if (!foundSequence)
            throw new Error(`Sequence Id ${sequenceId} is not valid.`)

        const foundEdge = foundSequence.flow.edges.find(
            ({ id }) => edgeId === id,
        )
        if (!foundEdge) {
            return sequences
            // throw new Error(`Edge Id ${edgeId} is not valid.`)
        }
        const newSequences = sequences.map((sequence) => {
            if (sequence.id !== foundSequence.id) return sequence

            sequence.flow.edges = sequence.flow.edges.map((edge) => {
                if (edge.id !== foundEdge.id) return edge

                return typeof newEdge === "function"
                    ? newEdge(foundEdge)
                    : newEdge
            })

            return sequence
        })

        return newSequences
    }
    return { selector, reducer }
}

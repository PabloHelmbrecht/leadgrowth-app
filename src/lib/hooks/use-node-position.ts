//React Flow
import { type ReactFlowState, useStore } from "@xyflow/react"

/**
 * Hook para obtener la posición de un nodo en el estado de React Flow.
 *
 * @param {string} nodeId - El ID del nodo cuya posición se desea obtener.
 * @returns {number | undefined} - El índice del nodo en el arreglo de nodos o `undefined` si no se encuentra.
 */
export function useNodePosition(nodeId: string): number | undefined {
    /**
     * Función que obtiene la posición del nodo en el estado.
     *
     * @param {ReactFlowState} state - El estado de React Flow.
     * @returns {number} - El índice del nodo en el arreglo de nodos o `undefined` si no se encuentra.
     */
    const getNodePosition = (state: ReactFlowState): number => {
        const { nodes } = state
        return nodes.findIndex(({ id }) => id === nodeId) ?? undefined
    }

    return useStore(getNodePosition)
}

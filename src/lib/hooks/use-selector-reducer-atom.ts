//React
import { useCallback, useMemo } from "react"

//Jotai
import { useAtom, type PrimitiveAtom } from "jotai"

//Zod
import { z } from "zod"

//Tan Stack
import type { ColumnFiltersState } from "@tanstack/react-table"

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

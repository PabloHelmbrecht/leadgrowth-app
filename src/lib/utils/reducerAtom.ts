import { useCallback, useMemo } from "react"
import { useAtom } from "jotai"
import type { PrimitiveAtom } from "jotai"

export function useReducerAtom<Value, Action>(
    anAtom: PrimitiveAtom<Value>,
    reducer: (v: Value, a: Action) => Value,
) {
    const [state, setState] = useAtom(anAtom)
    const dispatch = useCallback(
        (action: Action) => setState((prev) => reducer(prev, action)),
        [setState, reducer],
    )
    return [state, dispatch] as const
}

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

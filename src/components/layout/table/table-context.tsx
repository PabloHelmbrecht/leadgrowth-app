import { type ColumnFiltersState, type Table } from "@tanstack/react-table"
import { type PrimitiveAtom } from "jotai"
import { createContext } from "react"

export interface TableContext<Entity> {
    data: Entity[]
    isLoading: boolean
    isError: boolean
    tableAtom: PrimitiveAtom<Table<Entity> | null>
    IsAllRowsSelectedAtom: PrimitiveAtom<boolean>
    rowSelectionAtom: PrimitiveAtom<Record<string, boolean>>
    columnFiltersAtom: PrimitiveAtom<ColumnFiltersState>
    resetAllFiltersAtom: PrimitiveAtom<boolean>
}

export const tableContext = createContext<null | TableContext<unknown>>(null)

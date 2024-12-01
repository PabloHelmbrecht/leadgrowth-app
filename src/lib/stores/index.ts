import { atom } from "jotai"
import { z } from "zod"

//Page Search || Types
import type { Table, ColumnFiltersState } from "@tanstack/react-table"
import type { Sequence } from "./mockData"

//Layout || Atoms
export const sideBarAtom = atom<boolean>(true)

//Page Search || Atoms
export const tableSequenceAtom = atom<Table<Sequence> | null>(null)
export const IsAllRowsSelectedAtom = atom<boolean>(false)
export const rowSelectionAtom = atom<Record<Sequence["id"], boolean>>({})
export const columnFiltersAtom = atom<ColumnFiltersState>([
  { id: "status", value: ["active", "paused"] },
])
export const resetAllFiltersAtom = atom<boolean>(false)

// Page Search || Selector and Reduers Helper Functions

export function columnFilterSelectorReducer(columnId: string) {
  const selector = (prev: ColumnFiltersState): string[] =>
    z
      .array(z.object({ id: z.string(), value: z.array(z.string()) }))
      .parse(prev)
      .find((columnFilter) => columnFilter?.id === columnId)?.value ?? []
  const reducer = (prev: ColumnFiltersState, value: string[]) => [
    ...prev.filter(({ id }) => id !== columnId),
    { id: columnId, value },
  ]

  return { selector, reducer }
}

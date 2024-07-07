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
export const columnFiltersAtom = atom<ColumnFiltersState>([])
export const resetAllFiltersAtom = atom<boolean>(false)

export const handlerColumnFiltersAtom = atom(
  (get) => (columnId: string) => {
    try {
      return z
        .string()
        .array()
        .parse(
          get(columnFiltersAtom).find(
            (columnFilter) => columnFilter?.id === columnId,
          )?.value,
        )
    } catch (_e) {
      return []
    }
  },
  (get, set, columnId: string, value: string[]) =>
    set(columnFiltersAtom, [
      ...get(columnFiltersAtom).filter(({ id }) => id !== columnId),
      { id: columnId, value },
    ]),
)

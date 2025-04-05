import { atom } from "jotai"

//Types
import type { Table, ColumnFiltersState } from "@tanstack/react-table"
import type { Sequence } from "./mockData/sequence"

//Atoms
export const tableAtom = atom<Table<Sequence> | null>(null)
export const IsAllRowsSelectedAtom = atom<boolean>(false)
export const rowSelectionAtom = atom<Record<Sequence["id"], boolean>>({})
export const columnFiltersAtom = atom<ColumnFiltersState>([
    { id: "status", value: ["active", "paused"] },
])
export const resetAllFiltersAtom = atom<boolean>(false)

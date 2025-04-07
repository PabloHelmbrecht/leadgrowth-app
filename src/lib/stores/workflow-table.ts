import { atom } from "jotai"

//Types
import type { Table, ColumnFiltersState } from "@tanstack/react-table"
import type { Workflow } from "./mockData/workflow"

//Atoms
export const tableAtom = atom<Table<Workflow> | null>(null)
export const IsAllRowsSelectedAtom = atom<boolean>(false)
export const rowSelectionAtom = atom<Record<Workflow["id"], boolean>>({})
export const columnFiltersAtom = atom<ColumnFiltersState>([
    { id: "status", value: ["active", "paused"] },
])
export const resetAllFiltersAtom = atom<boolean>(false)

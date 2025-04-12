import { atom } from "jotai"

//Types
import type { Table, ColumnFiltersState } from "@tanstack/react-table"
import type { Action } from "./mockData/actions"

//Atoms
export const tableAtom = atom<Table<Action> | null>(null)
export const IsAllRowsSelectedAtom = atom<boolean>(false)
export const rowSelectionAtom = atom<Record<Action["id"], boolean>>({})
export const columnFiltersAtom = atom<ColumnFiltersState>([])
export const resetAllFiltersAtom = atom<boolean>(false)

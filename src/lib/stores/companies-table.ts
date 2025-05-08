import { atom } from "jotai"

//Types
import type { Table, ColumnFiltersState } from "@tanstack/react-table"
import { type Company } from "~/lib/hooks/use-companies"

//Atoms
export const tableAtom = atom<Table<Company> | null>(null)
export const IsAllRowsSelectedAtom = atom<boolean>(false)
export const rowSelectionAtom = atom<Record<Company["id"], boolean>>({})
export const columnFiltersAtom = atom<ColumnFiltersState>([])
export const resetAllFiltersAtom = atom<boolean>(false)

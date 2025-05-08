import { atom } from "jotai"

//Types
import type { Table, ColumnFiltersState } from "@tanstack/react-table"
import { type Contact } from "~/lib/hooks/use-contacts"

//Atoms
export const tableAtom = atom<Table<Contact> | null>(null)
export const IsAllRowsSelectedAtom = atom<boolean>(false)
export const rowSelectionAtom = atom<Record<Contact["id"], boolean>>({})
export const columnFiltersAtom = atom<ColumnFiltersState>([])
export const resetAllFiltersAtom = atom<boolean>(false)

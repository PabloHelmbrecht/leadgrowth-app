"use client"

//React
import { useContext } from "react"

//UI
import { Checkbox as CheckboxPrimitive } from "~/components/ui/checkbox"

//Atoms & Jotai
import { useAtom } from "jotai"
import { type TableContext, tableContext } from "../table-context"

export function SelectAllCheckbox() {
    const { tableAtom, IsAllRowsSelectedAtom } =
        useContext(tableContext) ?? ({} as TableContext<unknown>)

    const [tableInstance] = useAtom(tableAtom)
    const [isAllRowsSelected, setIsAllRowsSelected] = useAtom(
        IsAllRowsSelectedAtom,
    )
    return (
        <div className="flex min-h-8 items-center gap-2 pl-1">
            <CheckboxPrimitive
                id="terms"
                checked={isAllRowsSelected}
                onCheckedChange={() => {
                    tableInstance?.toggleAllPageRowsSelected(!isAllRowsSelected)
                    setIsAllRowsSelected(!isAllRowsSelected)
                }}
                aria-label="Select all"
            />
            <label
                htmlFor="terms"
                className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                Select all
            </label>
        </div>
    )
}

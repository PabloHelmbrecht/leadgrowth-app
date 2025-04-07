"use client"

//React
import { useContext } from "react"

//Class Merge
import { cn } from "~/lib/utils/classesMerge"

//Event Emmiter
import { eventEmmiter } from "~/lib/utils/eventEmmiter"

//Atoms & Jotai
import { useAtom } from "jotai"
import { useMemo } from "react"
import { type TableContext, tableContext } from "../table-context"

export function ClearFilterActionButton() {
    const { rowSelectionAtom, columnFiltersAtom } =
        useContext(tableContext) ?? ({} as TableContext)

    const [columnFilters] = useAtom(columnFiltersAtom)
    const [rowSelection] = useAtom(rowSelectionAtom)

    const isSomeFiltersActive: boolean = useMemo(
        () =>
            columnFilters.find(
                (columnFilter) =>
                    Array.isArray(columnFilter.value) &&
                    columnFilter.value.length !== 0,
            ) !== undefined,
        [columnFilters],
    )

    return (
        <button
            className={cn(
                " text-sm italic text-neutral-500 ",
                Object.keys(rowSelection).length !== 0 && "hidden",
                isSomeFiltersActive || "hidden",
            )}
            onClick={() => eventEmmiter.emit("resetAllFilters")}
        >
            Clean filters
        </button>
    )
}

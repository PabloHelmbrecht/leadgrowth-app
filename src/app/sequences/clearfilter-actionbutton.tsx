"use client"

//Class Merge
import { cn } from "~/lib/utils"

//Event Emmiter
import { eventEmmiter } from "~/lib/utils"

//Atoms & Jotai
import { useAtom } from "jotai"
import { columnFiltersAtom, rowSelectionAtom } from "~/lib/store"
import { useMemo } from "react"

export function ClearFilterActionButton() {
  const [columnFilters] = useAtom(columnFiltersAtom)
  const [rowSelection] = useAtom(rowSelectionAtom)

  const isSomeFiltersActive: boolean = useMemo(
    () =>
      columnFilters.find(
        (columnFilter) =>
          Array.isArray(columnFilter.value) && columnFilter.value.length !== 0,
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
      Reset filters
    </button>
  )
}

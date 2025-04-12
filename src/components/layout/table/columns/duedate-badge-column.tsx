//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//UI
import { BadgeColumn } from "./badge-column"

//Zod
import { z } from "zod"

//Translation
import { useFormatter } from "next-intl"

export function DueDateBadgeColumn<Entity>(
    cellContext: CellContext<Entity, unknown>,
) {
    const format = useFormatter()
    const date = z.coerce
        .date()
        .min(new Date("1900-01-01"))
        .safeParse(cellContext.cell.getValue())

    if (!date.success)
        return (
            <BadgeColumn
                label={"No valid date"}
                {...cellContext}
                className={"bg-danger-100 text-danger-800"}
            />
        )

    const now = new Date()
    const isDue = now.getTime() >= date.data.getTime()

    const label = format.relativeTime(date.data, now)

    return (
        <BadgeColumn
            label={label}
            {...cellContext}
            className={
                isDue
                    ? "bg-danger-100 text-danger-800"
                    : "bg-neutral-100 text-neutral-800"
            }
        />
    )
}

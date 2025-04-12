//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//UI
import { BadgeColumn } from "./badge-column"

//Zod
import { z } from "zod"

//Translation
import { type DateTimeFormatOptions, useFormatter } from "next-intl"

export function DateColumn<Entity>({
    date,
    dateTimeFormatOptions = {
        dateStyle: "medium",
        timeStyle: "short",
    },
    ...cellContext
}: CellContext<Entity, unknown> & {
    date?: Date
    dateTimeFormatOptions?: DateTimeFormatOptions
}) {
    const format = useFormatter()
    const parsedDate = z.coerce
        .date()
        .min(new Date("1900-01-01"))
        .safeParse(cellContext.cell.getValue())

    if (!parsedDate.success && !date)
        return (
            <BadgeColumn
                label={"No valid date"}
                {...cellContext}
                className={"bg-danger-100 text-danger-800"}
            />
        )

    return (
        <span {...cellContext}>
            {format.dateTime(
                date ?? parsedDate.data ?? new Date(),
                dateTimeFormatOptions,
            )}
        </span>
    )
}

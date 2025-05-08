//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//UI
import { BadgeColumn } from "./badge-column"

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

    if (!date)
        return (
            <BadgeColumn
                label={"No valid date"}
                {...cellContext}
                className={"bg-danger-100 text-danger-800"}
            />
        )

    return (
        <span {...cellContext}>
            {format.dateTime(date, dateTimeFormatOptions)}
        </span>
    )
}

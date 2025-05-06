"use client"

//Tanstack Table
import { type CellContext, type ColumnDef } from "@tanstack/react-table"

//UI
import { Checkbox } from "~/components/ui/checkbox"

//Types and Schemas
import { type Action } from "~/lib/stores/mockData/actions"

//Data Table Column Components
import { BadgeColumn } from "~/components/layout/table/columns/badge-column"
import { SettingsColumn } from "~/components/layout/table/columns/settings-column"
import { NameColumn } from "~/components/layout/table/columns/name-column"
import { TaskColumn } from "~/components/layout/table/columns/task-column"
import { AvatarColumn } from "~/components/layout/table/columns/avatar-column"
import { EventsColumn } from "~/components/layout/table/columns/events-column"
import { DateColumn } from "~/components/layout/table/columns/date-column"

export const columns: ColumnDef<Action>[] = [
    {
        id: "select",
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "contact",
        header: "Contact",
        cell: (cellContext: CellContext<Action, unknown>) => (
            <NameColumn {...cellContext} />
        ),
    },
    {
        accessorKey: "type",
        header: "Task",
        filterFn: "includesValueInArray" as "auto",
        cell: (cellContext: CellContext<Action, unknown>) => (
            <TaskColumn {...cellContext} />
        ),
    },

    {
        accessorKey: "events",
        header: "Events",
        cell: (cellContext: CellContext<Action, unknown>) => (
            <></>
            // <EventsColumn {...cellContext} />
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        filterFn: "includesValueInArray" as "auto",
        cell: (cellContext: CellContext<Action, unknown>) => {
            const stateDictionary = {
                scheduled: {
                    label: "Scheduled",
                    color: "bg-slate-100 text-slate-800",
                },
                completed: {
                    label: "Completed",
                    color: "bg-success-100 text-success-800",
                },
                skipped: {
                    label: "Skipped",
                    color: "bg-slate-100 text-slate-800",
                },
                error: {
                    label: "Error",
                    color: "bg-danger-100 text-danger-800",
                },
                delay: {
                    label: "Error",
                    color: "bg-warning-100 text-warning-800",
                },
            }

            const cellValue =
                cellContext.cell.getValue() as keyof typeof stateDictionary
            const statusValue = stateDictionary[cellValue]

            return (
                <BadgeColumn
                    {...cellContext}
                    className={statusValue?.color}
                    label={statusValue?.label}
                />
            )
        },
    },

    {
        accessorKey: "executed_at",
        header: "Time",
        filterFn: "includesValueInArray" as "auto",
        cell: (cellContext: CellContext<Action, unknown>) => (
            <DateColumn
                {...cellContext}
                date={
                    cellContext.row.original.executed_at ??
                    cellContext.row.original.scheduled_at
                }
            />
        ),
    },
    {
        accessorKey: "user",
        header: "User",
        filterFn: "includesValueInArray" as "auto",
        cell: (cellContext: CellContext<Action, unknown>) => (
            // <AvatarColumn profile={cellContext.row.original.user} />
            <></>
        ),
    },

    {
        id: "actions",
        cell: (cellContext: CellContext<Action, unknown>) => (
            <SettingsColumn actions={[]} {...cellContext} />
        ),
    },
]

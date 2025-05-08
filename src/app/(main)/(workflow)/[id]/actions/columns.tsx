"use client"

//Tanstack Table
import { type CellContext, type ColumnDef } from "@tanstack/react-table"

//UI
// import { Checkbox } from "~/components/ui/checkbox"

//Types and Schemas
import { type Action } from "~/lib/hooks/use-actions"

//Const
import { actionStatus } from "~/lib/constants/status"

//Data Table Column Components
import { BadgeColumn } from "~/components/layout/table/columns/badge-column"
// import { SettingsColumn } from "~/components/layout/table/columns/settings-column"
import { NameColumn } from "~/components/layout/table/columns/name-column"
import { TaskColumn } from "~/components/layout/table/columns/task-column"
import { AvatarColumn } from "~/components/layout/table/columns/avatar-column"
import { EventsColumn } from "~/components/layout/table/columns/events-column"
import { DateColumn } from "~/components/layout/table/columns/date-column"

export const columns: ColumnDef<Action>[] = [
    // {
    //     id: "select",
    //     cell: ({ row }) => (
    //         <Checkbox
    //             checked={row.getIsSelected()}
    //             onCheckedChange={(value) => row.toggleSelected(!!value)}
    //             aria-label="Select row"
    //         />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    // },
    {
        accessorKey: "type",
        header: "Action",
        filterFn: "includesValueInArray" as "auto",
        cell: (cellContext: CellContext<Action, unknown>) => (
            <TaskColumn {...cellContext} />
        ),
    },
    {
        accessorKey: "contact",
        header: "Contact",
        filterFn: "includesValueInArray" as "auto",
        accessorFn: (row) => row.contact?.id,
        cell: (cellContext: CellContext<Action, unknown>) => (
            <NameColumn {...cellContext} />
        ),
    },

    {
        accessorKey: "events",
        header: "Events",
        cell: (cellContext: CellContext<Action, unknown>) => (
            <EventsColumn {...cellContext} />
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        filterFn: "includesValueInArray" as "auto",
        cell: (cellContext: CellContext<Action, unknown>) => {
            const value = cellContext.row.original.status
            const statusValue = actionStatus.find(
                (status) => status.value === value,
            )

            return (
                <BadgeColumn
                    {...cellContext}
                    className={statusValue?.className}
                    label={statusValue?.label}
                />
            )
        },
    },

    {
        accessorKey: "executed_at",
        header: "Time",
        filterFn: "includesValueInArray" as "auto",
        cell: (cellContext: CellContext<Action, unknown>) => {
            const {
                row: { original: action },
            } = cellContext

            let date
            if (action.status === "pending" && action.created_at)
                date = new Date(action.created_at)

            if (action.status === "scheduled" && action.scheduled_at)
                date = new Date(action.scheduled_at)

            if (action.status === "completed" && action.completed_at)
                date = new Date(action.completed_at)

            if (action.status === "error" && action.executed_at)
                date = new Date(action.executed_at)

            if (action.status === "delayed" && action.scheduled_at)
                date = new Date(action.scheduled_at)

            if (action.status === "skipped" && action.skipped_at)
                date = new Date(action.skipped_at)

            return <DateColumn {...cellContext} date={date} />
        },
    },
    {
        accessorKey: "user",
        header: "Owner",
        accessorFn: (row) => row.owner.id,
        filterFn: "includesValueInArray" as "auto",
        cell: (cellContext: CellContext<Action, unknown>) => (
            <AvatarColumn profile={cellContext.row.original.owner} />
        ),
    },
    {
        accessorKey: "company",
        filterFn: "includesValueInArray" as "auto",
        accessorFn: (row) => row.company?.id,
        enableHiding: false,
    },

    // {
    //     id: "actions",
    //     cell: (cellContext: CellContext<Action, unknown>) => (
    //         <SettingsColumn actions={[]} {...cellContext} />
    //     ),
    // },
]

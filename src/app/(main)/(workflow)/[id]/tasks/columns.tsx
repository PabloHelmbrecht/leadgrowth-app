"use client"

//Tanstack Table
import { type CellContext, type ColumnDef } from "@tanstack/react-table"

//UI
import { Checkbox } from "~/components/ui/checkbox"

//Types and Schemas
import { type Action } from "~/lib/hooks/use-actions"

//Const
import { actionStatus } from "~/lib/constants/status"
import { priorityOptions } from "~/lib/constants/priority"

//Data Table Column Components
import { BadgeColumn } from "~/components/layout/table/columns/badge-column"
import { SettingsColumn } from "~/components/layout/table/columns/settings-column"
import { NameColumn } from "~/components/layout/table/columns/name-column"
import { DueDateBadgeColumn } from "~/components/layout/table/columns/duedate-badge-column"
import { TaskColumn } from "~/components/layout/table/columns/task-column"
import { AvatarColumn } from "~/components/layout/table/columns/avatar-column"

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
        accessorKey: "type",
        header: "Task",
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
        accessorKey: "status",
        header: "Status",
        filterFn: "includesValueInArray" as "auto",
        accessorFn: (row) => {
            const { status } = row

            if (status === "pending" || status === "skipped") return status

            return "completed"
        },
        cell: (cellContext: CellContext<Action, unknown>) => {
            const status = cellContext.row.original.status
            const value =
                status === "pending" || status === "skipped"
                    ? status
                    : "completed"

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
        accessorKey: "priority",
        header: "Priority",
        filterFn: "includesValueInArray" as "auto",
        cell: (cellContext: CellContext<Action, unknown>) => {
            const value = cellContext.row.original.priority

            const priority = priorityOptions.find(
                (priority) => priority.value === value,
            )

            return (
                <BadgeColumn
                    {...cellContext}
                    className={priority?.className}
                    label={priority?.label}
                />
            )
        },
    },
    {
        accessorKey: "due_at",
        header: "Due at",
        filterFn: "includesValueInArray" as "auto",
        cell: (cellContext: CellContext<Action, unknown>) => (
            <DueDateBadgeColumn {...cellContext} />
        ),
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

    {
        id: "actions",
        cell: (cellContext: CellContext<Action, unknown>) => (
            <SettingsColumn actions={[]} {...cellContext} />
        ),
    },
]

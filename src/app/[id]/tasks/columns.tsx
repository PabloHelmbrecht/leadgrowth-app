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
import { DueDateBadgeColumn } from "~/components/layout/table/columns/duedate-badge-column"
import { TaskColumn } from "~/components/layout/table/columns/task-column"
import { UserColumn } from "~/components/layout/table/columns/user-column"

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
        filterFn: "includesStringInArrAndShowWithEmptyFilter" as "auto",
        cell: (cellContext: CellContext<Action, unknown>) => (
            <TaskColumn {...cellContext} />
        ),
    },
    {
        accessorKey: "contact",
        header: "Contact",
        cell: (cellContext: CellContext<Action, unknown>) => (
            <NameColumn {...cellContext} />
        ),
    },

    {
        accessorKey: "status",
        header: "Status",
        filterFn: "includesStringInArrAndShowWithEmptyFilter" as "auto",
        cell: (cellContext: CellContext<Action, unknown>) => {
            const stateDictionary = {
                scheduled: {
                    label: "Scheduled",
                    color: "bg-success-100 text-success-800",
                },
                pending: {
                    label: "Pending",
                    color: "bg-neutral-100 text-neutral-800",
                },
                completed: {
                    label: "Completed",
                    color: "bg-success-100 text-success-800",
                },
                skipped: {
                    label: "Skipped",
                    color: "bg-neutral-100 text-neutral-800",
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
        accessorKey: "priority",
        header: "Priority",
        filterFn: "includesStringInArrAndShowWithEmptyFilter" as "auto",
        cell: (cellContext: CellContext<Action, unknown>) => {
            const stateDictionary = {
                high: {
                    label: "High",
                    color: "bg-danger-100 text-danger-800",
                },
                medium: {
                    label: "Medium",
                    color: "bg-warning-100 text-warning-800",
                },
                low: {
                    label: "Unsubscribed",
                    color: "bg-neutral-100 text-neutral-800",
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
        accessorKey: "due_at",
        header: "Due at",
        filterFn: "includesStringInArrAndShowWithEmptyFilter" as "auto",
        cell: (cellContext: CellContext<Action, unknown>) => (
            <DueDateBadgeColumn {...cellContext} />
        ),
    },
    {
        accessorKey: "user",
        header: "User",
        filterFn: "includesStringInArrAndShowWithEmptyFilter" as "auto",
        cell: (cellContext: CellContext<Action, unknown>) => (
            <UserColumn {...cellContext} />
        ),
    },

    {
        id: "actions",
        cell: (cellContext: CellContext<Action, unknown>) => (
            <SettingsColumn actions={[]} {...cellContext} />
        ),
    },
]

"use client"

//Tanstack Table
import { type CellContext, type ColumnDef } from "@tanstack/react-table"

//UI
import { Checkbox } from "~/components/ui/checkbox"

//Utils
// import { getPercentage } from "~/lib/utils/formatters"

//Types and Schemas
import { type Contact } from "~/lib/hooks/use-contacts"

//Const
import { flowActions } from "~/lib/constants/flow-actions"

//Data Table Column Components
import { EventsColumn } from "~/components/layout/table/columns/events-column"
import { BadgeColumn } from "~/components/layout/table/columns/badge-column"
import { SettingsColumn } from "~/components/layout/table/columns/settings-column"

export const columns: ColumnDef<Contact>[] = [
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
        accessorKey: "name",
        header: "Name",
        cell: (cellContext: CellContext<Contact, unknown>) => (
            <span>{`${String(cellContext.row.original.first_name)} ${String(cellContext.row.original.last_name)}`}</span>
        ),
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "company",
        header: "Company",
        filterFn: "includesSomeInObject" as "auto",
        cell: ({ row }: CellContext<Contact, unknown>) =>
            row.original.company?.name,
    },
    {
        accessorKey: "events",
        header: "Events",
        cell: (cellContext: CellContext<Contact, unknown>) => (
            <EventsColumn {...cellContext} />
        ),
    },

    {
        accessorKey: "stage",
        header: "Stage",
        filterFn: "includesSomeInObject" as "auto",
        cell: (cellContext: CellContext<Contact, unknown>) => {
            const { row } = cellContext
            const stage = String(row.original.stage?.label)

            return (
                <BadgeColumn
                    {...cellContext}
                    className="min-w-24 bg-slate-100 text-slate-800"
                    label={stage}
                />
            )
        },
    },
    {
        accessorKey: "step",
        header: "Step",
        filterFn: "includesSomeInObject" as "auto",
        accessorFn: (row) => {
            const mostRecentAction = row.actions?.sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
            )[0]
            const stepType = mostRecentAction?.nodes?.type

            return {
                label: stepType
                    ? flowActions.find((action) => action.type === stepType)
                          ?.name
                    : "No step",
                value: stepType,
            }
        },
        cell: (cellContext: CellContext<Contact, unknown>) => {
            const { row } = cellContext
            const mostRecentAction = row.original.actions?.sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
            )[0]

            const stepType = mostRecentAction?.nodes?.type

            return (
                <BadgeColumn
                    {...cellContext}
                    className="bg-slate-500 text-white"
                    label={
                        stepType
                            ? flowActions.find(
                                  (action) => action.type === stepType,
                              )?.name
                            : "No step"
                    }
                />
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        accessorFn: (row) => {
            const status = row.executions?.sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
            )[0]?.status
            const statusDictionary = {
                active: {
                    label: "Active",
                    color: "bg-primary-100 text-primary-800",
                },
                paused: {
                    label: "Paused",
                    color: "bg-slate-100 text-slate-800",
                },
                unsubscribed: {
                    label: "Unsubscribed",
                    color: "bg-danger-100 text-danger-800",
                },
                bounced: {
                    label: "Bounced",
                    color: "bg-danger-100 text-danger-800",
                },
                spam: {
                    label: "Spam",
                    color: "bg-danger-100 text-danger-800",
                },
                finished: {
                    label: "Finished",
                    color: "bg-success-100 text-success-800",
                },
            }

            return {
                label: status ? statusDictionary[status]?.label : "No status",
                color: status
                    ? statusDictionary[status]?.color
                    : "bg-slate-100 text-slate-800",
                value: status,
            }
        },
        filterFn: "includesSomeInObject" as "auto",
        cell: (cellContext: CellContext<Contact, unknown>) => {
            const { row } = cellContext

            const status = row.original.executions?.sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
            )[0]?.status
            const statusDictionary = {
                active: {
                    label: "Active",
                    color: "bg-primary-100 text-primary-800",
                },
                paused: {
                    label: "Paused",
                    color: "bg-slate-100 text-slate-800",
                },
                unsubscribed: {
                    label: "Unsubscribed",
                    color: "bg-danger-100 text-danger-800",
                },
                bounced: {
                    label: "Bounced",
                    color: "bg-danger-100 text-danger-800",
                },
                spam: {
                    label: "Spam",
                    color: "bg-danger-100 text-danger-800",
                },
                finished: {
                    label: "Finished",
                    color: "bg-success-100 text-success-800",
                },
            }

            const statusValue = status ? statusDictionary[status] : null

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
        id: "actions",
        cell: (cellContext: CellContext<Contact, unknown>) => (
            <SettingsColumn actions={[]} {...cellContext} />
        ),
    },
]

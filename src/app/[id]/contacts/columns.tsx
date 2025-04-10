"use client"

//Tanstack Table
import { type CellContext, type ColumnDef } from "@tanstack/react-table"

//UI
import { Checkbox } from "~/components/ui/checkbox"

//Utils
// import { getPercentage } from "~/lib/utils/formatters"

//Types and Schemas
import { type Contact } from "~/lib/stores/mockData/contact"

//Data Table Column Components
import { EventsColumn } from "~/components/layout/table/columns/events-column"
import { BadgeColumn } from "~/components/layout/table/columns/badge-column"
import { ActionsColumn } from "~/components/layout/table/columns/actions-column"

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
            <span>{`${String(cellContext.row.original.firstName)} ${String(cellContext.row.original.lastName)}`}</span>
        ),
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "company",
        header: "Company",
        filterFn: "includesStringInArrAndShowWithEmptyFilter" as "auto",

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
        filterFn: "includesStringInArrAndShowWithEmptyFilter" as "auto",
        cell: (cellContext: CellContext<Contact, unknown>) => (
            <BadgeColumn
                {...cellContext}
                className="bg-neutral-100 text-neutral-800"
            />
        ),
    },
    {
        accessorKey: "step",
        header: "Step",
        filterFn: "includesStringInArrAndShowWithEmptyFilter" as "auto",
        cell: (cellContext: CellContext<Contact, unknown>) => (
            <BadgeColumn
                {...cellContext}
                className="bg-neutral-500 text-white"
                label={`Step ${String(cellContext.cell.getValue())}`}
            />
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        filterFn: "includesStringInArrAndShowWithEmptyFilter" as "auto",
        cell: (cellContext: CellContext<Contact, unknown>) => {
            const statusDictionary = {
                active: {
                    label: "Active",
                    color: "bg-primary-100 text-primary-800",
                },
                paused: {
                    label: "Paused",
                    color: "bg-neutral-100 text-neutral-800",
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

            const cellValue =
                cellContext.cell.getValue() as keyof typeof statusDictionary
            const statusValue = statusDictionary[cellValue]

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
            <ActionsColumn actions={[]} {...cellContext} />
        ),
    },
]

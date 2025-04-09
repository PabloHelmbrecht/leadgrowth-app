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
import { NameColumn } from "./name-column"
import { BadgesColumn } from "./badges-column"
import { EventsColumn } from "./events-column"
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
        cell: (cellContext: CellContext<Contact, unknown>) => (
            <NameColumn {...cellContext} />
        ),
    },
    {
        accessorKey: "bagdes",
        cell: (cellContext: CellContext<Contact, unknown>) => (
            <BadgesColumn {...cellContext} />
        ),
    },
    {
        accessorKey: "events",
        header: "Events",
        cell: (cellContext: CellContext<Contact, unknown>) => (
            <EventsColumn {...cellContext} />
        ),
    },
    {
        id: "actions",
        cell: (cellContext: CellContext<Contact, unknown>) => (
            <ActionsColumn cellContext={cellContext} actions={[]} />
        ),
    },
    {
        accessorKey: "stage",
        enableHiding: false,
        filterFn: "includesStringInArrAndShowWithEmptyFilter" as "auto",
    },
    {
        accessorKey: "step",
        enableHiding: false,
        filterFn: "includesStringInArrAndShowWithEmptyFilter" as "auto",
    },
    {
        accessorKey: "status",
        enableHiding: false,
        filterFn: "includesStringInArrAndShowWithEmptyFilter" as "auto",
    },
    {
        accessorKey: "company",
        enableHiding: false,
        filterFn: "includesStringInArrAndShowWithEmptyFilter" as "auto",
    },
]

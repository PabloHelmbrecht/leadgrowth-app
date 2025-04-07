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
import { NameColumn } from "./table-columns/name-column"
import { BadgesColumn } from "./table-columns/badges-column"
import { EventsColumn } from "./table-columns/events-column"
import { ActionsColumn } from "./table-columns/actions-column"

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
        cell: (cellContext: CellContext<Contact, unknown>) => (
            <EventsColumn {...cellContext} />
        ),
    },
    {
        id: "actions",
        cell: (cellContext: CellContext<Contact, unknown>) => (
            <ActionsColumn {...cellContext} />
        ),
    },
]

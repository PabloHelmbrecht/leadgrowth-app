"use client"

//Tanstack Table
import { type CellContext, type ColumnDef } from "@tanstack/react-table"

//UI
import { Checkbox } from "~/components/ui/checkbox"

//Utils
// import { getPercentage } from "~/lib/utils/formatters"

//Types and Schemas
import { type Contact } from "~/lib/hooks/use-contacts"

//Hooks
import { useCustomFields } from "~/lib/hooks/use-custom-fields"

//Data Table Column Components
import { EventsColumn } from "~/components/layout/table/columns/events-column"
import { BadgeColumn } from "~/components/layout/table/columns/badge-column"
import { SettingsColumn } from "~/components/layout/table/columns/settings-column"

export const useColumns = () => {
    const { data: customFields } = useCustomFields({
        entityType: "contact",
    })

    const baseColumns: ColumnDef<Contact>[] = [
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
    ]

    const endColumns: ColumnDef<Contact>[] = [
        {
            id: "actions",
            cell: (cellContext: CellContext<Contact, unknown>) => (
                <SettingsColumn actions={[]} {...cellContext} />
            ),
        },
    ]
    const customColumns: ColumnDef<Contact>[] =
        customFields?.map((field) => ({
            accessorKey: `custom_fields.${field.id}`,
            header: field.label ?? field.id,
            filterFn: "includesValueInArray" as "auto",
            // cell: (cellContext: CellContext<Contact, unknown>) => {

            //     r
            // },
        })) ?? []

    return [...baseColumns, ...customColumns, ...endColumns]
}

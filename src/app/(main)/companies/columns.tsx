"use client"

//Tanstack Table
import { type CellContext, type ColumnDef } from "@tanstack/react-table"

//UI
import { Checkbox } from "~/components/ui/checkbox"

//Utils
// import { getPercentage } from "~/lib/utils/formatters"

//Types and Schemas
import { type Company } from "~/lib/hooks/use-companies"

//Hooks
import { useCustomFields } from "~/lib/hooks/use-custom-fields"

//Data Table Column Components
// import { EventsColumn } from "~/components/layout/table/columns/events-column"
// import { BadgeColumn } from "~/components/layout/table/columns/badge-column"
import { SettingsColumn } from "~/components/layout/table/columns/settings-column"

export const useColumns = () => {
    const { data: customFields } = useCustomFields({
        entityType: "company",
    })

    const baseColumns: ColumnDef<Company>[] = [
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
            filterFn: "includesValueInArray" as "auto",
        },
    ]

    const endColumns: ColumnDef<Company>[] = [
        {
            id: "actions",
            cell: (cellContext: CellContext<Company, unknown>) => (
                <SettingsColumn actions={[]} {...cellContext} />
            ),
        },
    ]
    const customColumns: ColumnDef<Company>[] =
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

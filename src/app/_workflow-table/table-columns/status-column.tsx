//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//UI
import { Switch } from "~/components/ui/switch"

//Zod & Schemas & Types
import { z } from "zod"

import { type Workflow, tagSchema } from "~/lib/stores/mockData/workflow"

const tableMetaSchema = z.object({
    getTags: z.function().returns(z.array(tagSchema)),
    setWorkflowData: z
        .function()
        .args(z.string(), z.string(), z.unknown())
        .returns(z.void()),
    cloneWorkflow: z.function().args(z.string()),
    archiveWorkflow: z.function().args(z.string()),
})

export function StatusColumn({ row, table }: CellContext<Workflow, unknown>) {
    return (
        <Switch
            className={
                row.getValue("status") === "archived"
                    ? "data-[state=unchecked]:bg-danger-300"
                    : ""
            }
            disabled={row.getValue("status") === "archived"}
            checked={row.getValue("status") === "active"}
            onCheckedChange={(value) => {
                if (value) {
                    tableMetaSchema
                        .parse(table.options.meta)
                        .setWorkflowData(row.id, "status", "active")
                    return
                }

                tableMetaSchema
                    .parse(table.options.meta)
                    .setWorkflowData(row.id, "status", "paused")
            }}
        />
    )
}

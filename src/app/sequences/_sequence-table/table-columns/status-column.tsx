//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//UI
import { Switch } from "~/components/ui/switch"

//Zod & Schemas & Types
import { z } from "zod"

import { type Sequence, tagSchema } from "~/lib/stores/mockData/sequence"

const tableMetaSchema = z.object({
    getTags: z.function().returns(z.array(tagSchema)),
    setSequenceData: z
        .function()
        .args(z.string(), z.string(), z.unknown())
        .returns(z.void()),
    cloneSequence: z.function().args(z.string()),
    archiveSequence: z.function().args(z.string()),
})

export function StatusColumn({ row, table }: CellContext<Sequence, unknown>) {
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
                        .setSequenceData(row.id, "status", "active")
                    return
                }

                tableMetaSchema
                    .parse(table.options.meta)
                    .setSequenceData(row.id, "status", "paused")
            }}
        />
    )
}

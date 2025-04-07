//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//Icons
import { Star } from "@phosphor-icons/react/dist/ssr"

//Zod & Schemas & Types
import { z } from "zod"

import { type Workflow, tagSchema } from "~/lib/stores/mockData/workflow"

const arrayStringSchema = z.string().array()
const tableMetaSchema = z.object({
    getTags: z.function().returns(z.array(tagSchema)),
    setWorkflowData: z
        .function()
        .args(z.string(), z.string(), z.unknown())
        .returns(z.void()),
    cloneWorkflow: z.function().args(z.string()),
    archiveWorkflow: z.function().args(z.string()),
})

export function TagColumn({ row, table }: CellContext<Workflow, unknown>) {
    const isStarred = arrayStringSchema
        .parse(row.getValue("tag"))
        .includes("starred")
    const tags = arrayStringSchema.parse(row.getValue("tag"))

    const color = tableMetaSchema
        .parse(table.options.meta)
        .getTags()
        .find(({ value }) => value === "starred")?.color

    return (
        <button
            className="flex h-full items-center justify-center"
            onClick={() => {
                if (isStarred) {
                    tableMetaSchema.parse(table.options.meta).setWorkflowData(
                        row.id,
                        "tag",
                        tags.filter((tag) => tag !== "starred"),
                    )
                    return
                }

                tableMetaSchema
                    .parse(table.options.meta)
                    .setWorkflowData(row.id, "tag", [...tags, "starred"])
            }}
        >
            <Star
                size={22}
                weight={isStarred ? "fill" : "regular"}
                className=" text-neutral-900"
                style={{ color: isStarred ? color : "" }}
            />
        </button>
    )
}

//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//UI
import { Badge } from "~/components/ui/badge"

//Utils
import { Color } from "~/lib/utils/color"

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

export function NameColumn({ row, table }: CellContext<Workflow, unknown>) {
    return (
        <div className="flex h-full flex-1 flex-col items-start justify-start gap-2 overflow-clip whitespace-nowrap pl-2">
            {row.getValue("name")}
            <div className=" flex w-full items-start gap-2 overflow-clip ">
                {arrayStringSchema
                    .parse(row.getValue("tag"))
                    .filter((tag) => tag !== "starred")
                    .map((tag, k) => {
                        const tags = tableMetaSchema
                            .parse(table.options.meta)
                            .getTags()
                        const color = new Color(
                            tags.find(({ value }) => tag === value)?.color,
                        )
                        const textColor = color
                            .normalizeSB(90)
                            .adjustHSB({
                                hue: 0,
                                saturation: 40,
                                brightness: -40,
                            })
                            .getHex()
                        const backgroundColor = color
                            .normalizeSB(90)
                            .adjustHSB({
                                hue: 0,
                                saturation: -70,
                                brightness: 50,
                            })
                            .getHex()

                        return (
                            <Badge
                                key={k}
                                className="min-w-fit overflow-clip whitespace-nowrap font-normal"
                                style={{
                                    backgroundColor,
                                    color: textColor,
                                }}
                            >
                                {tags.find(({ value }) => tag === value)?.label}
                            </Badge>
                        )
                    })}
            </div>
        </div>
    )
}

//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//Nextjs
import Link from "next/link"

//UI
import { Badge } from "~/components/ui/badge"

//Utils
import { Color } from "~/lib/utils/color"

//Zod & Schemas & Types
import { z } from "zod"
import { type Workflow } from "~/lib/stores/mockData/workflow"

//Jotai & Atoms
import { tagsMockDataAtom } from "~/lib/stores/mockData/workflow"
import { useAtom } from "jotai"

const arrayStringSchema = z.string().array()

export function NameColumn({ row }: CellContext<Workflow, unknown>) {
    const [tags] = useAtom(tagsMockDataAtom)
    return (
        <div className="flex h-full flex-1 flex-col items-start justify-start gap-2 overflow-clip whitespace-nowrap pl-2">
            <Link href={`/${row.id}/flow`}>{row.getValue("name")}</Link>
            <div className=" flex w-full items-start gap-2 overflow-clip ">
                {arrayStringSchema
                    .parse(row.getValue("tag"))
                    .filter((tag) => tag !== "starred")
                    .map((tag, k) => {
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

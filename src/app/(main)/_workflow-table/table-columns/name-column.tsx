//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//Nextjs
import Link from "next/link"

//UI
import { Badge } from "~/components/ui/badge"

//Utils
import { Color } from "~/lib/utils/color"

//Tailwind
import colors from "tailwindcss/colors"
const slate = colors.slate["500"]

//Types
import { type Workflow as Workflow } from "~/lib/hooks/use-workflows"

export function WorkflowNameColumn({ row }: CellContext<Workflow, unknown>) {
    const tags = row.original.tags

    return (
        <div className="flex h-full flex-1 flex-col items-start justify-start gap-2 overflow-clip whitespace-nowrap pl-2">
            <Link href={`/${row.id}/flow`}>{row.original.name}</Link>
            <div className=" flex w-full items-start gap-2 overflow-clip ">
                {tags
                    ?.filter((tag) => tag.value !== "starred")
                    .map((tag, k) => {
                        const color = new Color(tag.color ?? slate)
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
                                {tag.label}
                            </Badge>
                        )
                    })}
            </div>
        </div>
    )
}

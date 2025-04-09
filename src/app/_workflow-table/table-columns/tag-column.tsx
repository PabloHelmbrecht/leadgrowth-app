//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//Icons
import { Star } from "@phosphor-icons/react/dist/ssr"

//Zod & Schemas & Types
import { z } from "zod"

import { type Workflow } from "~/lib/stores/mockData/workflow"

//Jotai & Atoms
import { tagsMockDataAtom } from "~/lib/stores/mockData/workflow"
import { workflowsMockDataAtom } from "~/lib/stores/mockData/workflow"
import {
    useSelectorReducerAtom,
    uniqueSelectorReducer,
} from "~/lib/hooks/use-selector-reducer-atom"
import { useAtom } from "jotai"

const arrayStringSchema = z.string().array()

export function TagColumn({ row }: CellContext<Workflow, unknown>) {
    const [, setWorkflow] = useSelectorReducerAtom(
        workflowsMockDataAtom,
        uniqueSelectorReducer<Workflow>(row.id),
    )

    const [tags] = useAtom(tagsMockDataAtom)

    const isStarred = arrayStringSchema
        .parse(row.getValue("tag"))
        .includes("starred")

    const color = tags.find(({ value }) => value === "starred")?.color

    return (
        <button
            className="flex h-full items-center justify-center"
            onClick={() => {
                if (isStarred) {
                    setWorkflow((item) => ({
                        ...item,
                        tag: item.tag.filter((tag) => tag !== "starred"),
                    }))
                    return
                }

                setWorkflow((item) => ({
                    ...item,
                    tag: [...item.tag, "starred"],
                }))
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

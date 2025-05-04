//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//Icons
import { Star } from "@phosphor-icons/react/dist/ssr"

//Types
import { type Workflow as Workflow } from "~/lib/hooks/use-workflows"

//Hooks
import { useTags } from "~/lib/hooks/use-tags"
import { useWorkflows } from "~/lib/hooks/use-workflows"

export function TagColumn({ row }: CellContext<Workflow, unknown>) {
    const { assignTag, removeTag } = useWorkflows({
        workflowId: row.original.id,
    })
    const { data: tags } = useTags({})

    const starredTag = row.original.tags?.find((tag) => tag.value === "starred")

    return (
        <button
            className="flex h-full items-center justify-center"
            onClick={async () => {
                if (starredTag) {
                    await removeTag({ tagId: starredTag.id })
                    return
                }

                if (!Array.isArray(tags)) return

                const starredTagId = tags.find(
                    (tag) => tag.value === "starred",
                )?.id
                if (!starredTagId) return

                await assignTag({ tagId: starredTagId })
            }}
        >
            <Star
                size={22}
                weight={starredTag ? "fill" : "regular"}
                className=" text-neutral-900"
                style={{
                    color: starredTag
                        ? (row.original.tags?.find(
                              (tag) => tag.value === "starred",
                          )?.color ?? "#eab308")
                        : "",
                }}
            />
        </button>
    )
}

"use client"

//React
import { useMemo } from "react"

//UI
import { Button } from "~/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandTagsGroup,
    CommandTag,
} from "~/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"

//Class Merge
import { cn } from "~/lib/utils/classesMerge"

//Icons
import { Tag, Star } from "@phosphor-icons/react/dist/ssr"

//Atoms & Jotai
import { useAtom } from "jotai"
import { rowSelectionAtom } from "~/lib/stores/workflow-table"
import { useTags } from "~/lib/hooks/use-tags"
import { useWorkflows } from "~/lib/hooks/use-workflows"

export function TagActionButton() {
    // Selección de filas
    const [rowSelection] = useAtom(rowSelectionAtom)
    // Datos reales
    const { data: tagsRaw } = useTags({})
    const tagsData = Array.isArray(tagsRaw) ? tagsRaw : []
    const { data: workflowsData = [], assignTag, removeTag } = useWorkflows({})

    // IDs de workflows seleccionados
    const selectedWorkflowIds = useMemo(
        () =>
            Object.keys(rowSelection)
                .filter((id) => rowSelection[id])
                .filter(Boolean),
        [rowSelection],
    )

    // Workflows seleccionados
    const selectedWorkflows = useMemo(
        () => workflowsData.filter((wf) => selectedWorkflowIds.includes(wf.id)),
        [workflowsData, selectedWorkflowIds],
    )

    // Tags seleccionados en la selección
    const tagsSelected = useMemo(() => {
        return selectedWorkflows.reduce((allTags: string[], workflow) => {
            const tagValues = (workflow.tags || [])
                .map((t) => t.value)
                .filter((v): v is string => typeof v === "string")
            return [...new Set([...allTags, ...tagValues])]
        }, [])
    }, [selectedWorkflows])

    // Handler para remover un tag de todos los seleccionados
    const handleRemoveTag = async (tagValue: string) => {
        const tag = tagsData.find(
            (t): t is typeof t & { value: string; id: string } =>
                t.value === tagValue && !!t.id,
        )
        if (!tag) return
        const payload = selectedWorkflowIds.map((workflowId) => ({
            tagId: tag.id,
            workflowId,
        }))
        await removeTag(payload)
    }

    // Handler para asignar un tag a todos los seleccionados
    const handleAssignTag = async (tagValue: string) => {
        const tag = tagsData.find(
            (t): t is typeof t & { value: string; id: string } =>
                t.value === tagValue && !!t.id,
        )
        if (!tag) return
        const payload = selectedWorkflowIds.map((workflowId) => ({
            tagId: tag.id,
            workflowId,
        }))
        await assignTag(payload)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"secondary"}
                    size={"sm"}
                    className={cn(
                        " font-regular flex h-fit w-fit items-center gap-2  rounded-full px-3 py-1",
                        selectedWorkflowIds.length === 0 && "hidden",
                    )}
                >
                    <Tag
                        width={16}
                        height={16}
                        weight="bold"
                        className="aspect-square min-w-4"
                        alt={"config workflow button"}
                    />
                    Set Tags
                </Button>
            </PopoverTrigger>
            <PopoverContent className=" w-72 p-0">
                <Command>
                    <CommandInput placeholder="Select tags..." />
                    {tagsSelected.length !== 0 && (
                        <CommandTagsGroup>
                            {tagsSelected.map((currentValue: string) => {
                                const tagObj = tagsData.find(
                                    (
                                        item,
                                    ): item is typeof item & {
                                        value: string
                                    } =>
                                        item.value === currentValue &&
                                        typeof item.value === "string",
                                )
                                return (
                                    <CommandTag
                                        key={currentValue}
                                        onClick={() =>
                                            handleRemoveTag(currentValue)
                                        }
                                        className="flex items-center justify-start gap-2"
                                    >
                                        {currentValue === "starred" ? (
                                            <Star
                                                size={14}
                                                weight="fill"
                                                className=" -mx-[3px]"
                                                style={{
                                                    color: tagObj?.color ?? "",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className=" aspect-square w-2 rounded-full bg-neutral-500"
                                                style={{
                                                    backgroundColor:
                                                        tagObj?.color ?? "",
                                                }}
                                            />
                                        )}
                                        {tagObj?.label}
                                    </CommandTag>
                                )
                            })}
                        </CommandTagsGroup>
                    )}
                    <CommandList>
                        <CommandEmpty>No tags found.</CommandEmpty>
                        <CommandGroup>
                            {tagsData
                                .filter(
                                    (
                                        tag,
                                    ): tag is typeof tag & { value: string } =>
                                        typeof tag.value === "string" &&
                                        !tagsSelected.includes(tag.value),
                                )
                                .map((tag) => (
                                    <CommandItem
                                        key={tag.value}
                                        value={tag.value}
                                        onSelect={(currentValue: string) =>
                                            handleAssignTag(currentValue)
                                        }
                                        className="flex items-center justify-start gap-2"
                                    >
                                        {tag.value === "starred" ? (
                                            <Star
                                                size={14}
                                                weight="fill"
                                                className=" -mx-[3px]"
                                                style={{
                                                    color: tag.color ?? "",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className=" aspect-square w-2 rounded-full bg-neutral-500"
                                                style={{
                                                    backgroundColor:
                                                        tag.color ?? "",
                                                }}
                                            />
                                        )}
                                        {tag.label}
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

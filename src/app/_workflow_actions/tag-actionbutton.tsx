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
import {
    tagsMockDataAtom,
    workflowsMockDataAtom,
} from "~/lib/stores/mockData/workflow"

export function TagActionButton() {
    //Mock data
    const [tagsMockData] = useAtom(tagsMockDataAtom)
    const [rowSelection] = useAtom(rowSelectionAtom)
    const [workflowMockData, setWorkflowsMockData] = useAtom(
        workflowsMockDataAtom,
    )

    //Get tags of selection
    const tagsSelected = useMemo(() => {
        return workflowMockData
            .filter((workflow) =>
                Object.keys(rowSelection)
                    .filter((id) => rowSelection[id])
                    .includes(workflow.id),
            )
            .reduce(
                (allTags: string[], workflow) => [
                    ...new Set([...allTags, ...workflow.tag]),
                ],
                [],
            )
    }, [rowSelection, workflowMockData])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"secondary"}
                    size={"sm"}
                    className={cn(
                        " font-regular flex h-fit w-fit items-center gap-2  rounded-full px-3 py-1",
                        Object.keys(rowSelection).length === 0 && "hidden",
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
                            {tagsSelected.map((currentValue) => (
                                <CommandTag
                                    key={currentValue}
                                    onClick={() => {
                                        setWorkflowsMockData(
                                            (oldWorkflowsMockData) =>
                                                oldWorkflowsMockData.map(
                                                    (workflow) => {
                                                        if (
                                                            Object.keys(
                                                                rowSelection,
                                                            )
                                                                .filter(
                                                                    (id) =>
                                                                        rowSelection[
                                                                            id
                                                                        ],
                                                                )
                                                                .includes(
                                                                    workflow.id,
                                                                )
                                                        ) {
                                                            return {
                                                                ...workflow,
                                                                tag: workflow.tag.filter(
                                                                    (tag) =>
                                                                        tag !==
                                                                        currentValue,
                                                                ),
                                                            }
                                                        }
                                                        return workflow
                                                    },
                                                ),
                                        )
                                    }}
                                    className="flex items-center justify-start gap-2"
                                >
                                    {currentValue === "starred" ? (
                                        <Star
                                            size={14}
                                            weight="fill"
                                            className=" -mx-[3px]"
                                            style={{
                                                color:
                                                    tagsMockData.find(
                                                        (item) =>
                                                            item.value ===
                                                            currentValue,
                                                    )?.color ?? "",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className=" aspect-square w-2 rounded-full bg-neutral-500"
                                            style={{
                                                backgroundColor:
                                                    tagsMockData.find(
                                                        (item) =>
                                                            item.value ===
                                                            currentValue,
                                                    )?.color ?? "",
                                            }}
                                        />
                                    )}

                                    {
                                        tagsMockData.find(
                                            (item) =>
                                                item.value === currentValue,
                                        )?.label
                                    }
                                </CommandTag>
                            ))}
                        </CommandTagsGroup>
                    )}
                    <CommandList>
                        <CommandEmpty>No tags found.</CommandEmpty>

                        <CommandGroup>
                            {tagsMockData
                                .filter(
                                    (tag) => !tagsSelected.includes(tag.value),
                                )

                                .map((tag) => (
                                    <CommandItem
                                        key={tag.value}
                                        value={tag.value}
                                        onSelect={(currentValue) => {
                                            setWorkflowsMockData(
                                                (oldWorkflowsMockData) =>
                                                    oldWorkflowsMockData.map(
                                                        (workflow) => {
                                                            if (
                                                                Object.keys(
                                                                    rowSelection,
                                                                )
                                                                    .filter(
                                                                        (id) =>
                                                                            rowSelection[
                                                                                id
                                                                            ],
                                                                    )
                                                                    .includes(
                                                                        workflow.id,
                                                                    )
                                                            ) {
                                                                return {
                                                                    ...workflow,
                                                                    tag: [
                                                                        ...new Set(
                                                                            [
                                                                                ...workflow.tag,
                                                                                currentValue,
                                                                            ],
                                                                        ),
                                                                    ],
                                                                }
                                                            }
                                                            return workflow
                                                        },
                                                    ),
                                            )
                                        }}
                                        className="flex items-center justify-start gap-2"
                                    >
                                        {tag.value === "starred" ? (
                                            <Star
                                                size={14}
                                                weight="fill"
                                                className=" -mx-[3px]"
                                                style={{
                                                    color:
                                                        tagsMockData.find(
                                                            (item) =>
                                                                item.value ===
                                                                tag.value,
                                                        )?.color ?? "",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className=" aspect-square w-2 rounded-full bg-neutral-500"
                                                style={{
                                                    backgroundColor:
                                                        tagsMockData.find(
                                                            (item) =>
                                                                item.value ===
                                                                tag.value,
                                                        )?.color ?? "",
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

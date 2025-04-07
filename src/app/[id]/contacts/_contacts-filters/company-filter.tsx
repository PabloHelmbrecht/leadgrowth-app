"use client"

//React
import { useEffect, useState } from "react"

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

//Class Merge & Event Emmiter
import { cn } from "~/lib/utils/classesMerge"
import { eventEmmiter } from "~/lib/utils/eventEmmiter"
import {
    useSelectorReducerAtom,
    columnFilterSelectorReducer,
} from "~/lib/hooks/use-selector-reducer-atom"

//Icons
import { CaretDown } from "@phosphor-icons/react/dist/ssr"

//Atoms & Jotai
import { useAtom } from "jotai"
import { columnFiltersAtom, rowSelectionAtom } from "~/lib/stores/contact-table"
import { companiesMockDataAtom } from "~/lib/stores/mockData/contact"

export function CompanyFilter() {
    //Mock data
    const [companiesMockData] = useAtom(companiesMockDataAtom)
    const [rowSelection] = useAtom(rowSelectionAtom)

    const [open, setOpen] = useState(false)

    const [columnFilters, setColumnFilters] = useSelectorReducerAtom(
        columnFiltersAtom,
        columnFilterSelectorReducer("company"),
    )

    //Reset filter when button "Reset filters" is clicked
    useEffect(() => {
        const handleEvent = () => {
            setColumnFilters([])
        }

        eventEmmiter.on("resetAllFilters", handleEvent)

        return () => {
            eventEmmiter.off("resetAllFilters", handleEvent)
        }
    }, [setColumnFilters])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"secondary"}
                    size={"sm"}
                    className={cn(
                        " font-regular relative flex h-fit w-fit items-center gap-2 rounded-full px-3 py-1",
                        Object.keys(rowSelection).length !== 0 && "hidden",
                    )}
                >
                    <CaretDown
                        width={16}
                        height={16}
                        weight="bold"
                        className="aspect-square min-w-4"
                        alt={"config workflow button"}
                    />
                    Company
                    {columnFilters.length !== 0 && (
                        <div className="-ml-1 text-xs text-neutral-500">
                            {`+${columnFilters.length}`}
                        </div>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className=" w-72 p-0">
                <Command>
                    <CommandInput placeholder="Search companies..." />

                    {columnFilters.length !== 0 && (
                        <CommandTagsGroup>
                            {columnFilters.map((currentValue) => (
                                <CommandTag
                                    key={currentValue}
                                    onClick={() =>
                                        setColumnFilters(
                                            columnFilters.filter(
                                                (item) => item !== currentValue,
                                            ),
                                        )
                                    }
                                >
                                    {
                                        companiesMockData.find(
                                            (item) =>
                                                item.value === currentValue,
                                        )?.label
                                    }
                                </CommandTag>
                            ))}
                        </CommandTagsGroup>
                    )}

                    <CommandList>
                        <CommandEmpty>No companies found.</CommandEmpty>

                        <CommandGroup>
                            {companiesMockData
                                .filter(
                                    (item) =>
                                        !columnFilters.includes(item.value),
                                )
                                .map((framework) => (
                                    <CommandItem
                                        key={framework.value}
                                        value={framework.value}
                                        onSelect={(currentValue) => {
                                            if (
                                                !columnFilters.includes(
                                                    currentValue,
                                                )
                                            ) {
                                                setColumnFilters([
                                                    ...new Set([
                                                        ...columnFilters,
                                                        currentValue,
                                                    ]),
                                                ])
                                            } else {
                                                setColumnFilters(
                                                    columnFilters.filter(
                                                        (item) =>
                                                            item !==
                                                            currentValue,
                                                    ),
                                                )
                                            }
                                        }}
                                    >
                                        {framework.label}
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

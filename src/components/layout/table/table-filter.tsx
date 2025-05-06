"use client"

//React
import { useContext, useEffect, useMemo, useState } from "react"

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
import { CaretDown, Star } from "@phosphor-icons/react/dist/ssr"

//Atoms & Jotai
import { useAtom } from "jotai"
import { type TableContext, tableContext } from "./table-context"

//Zod & Schemas
import { z } from "zod"

//Types
type options = {
    label: string
    value: string
    color?: string
}[]

export function TableFilter({
    options,
    filterName,
    columnName,
}: {
    options: options | string[]
    filterName: string
    columnName: string
}) {
    //Mock data
    const { rowSelectionAtom, columnFiltersAtom } =
        useContext(tableContext) ?? ({} as TableContext<unknown>)

    const [rowSelection] = useAtom(rowSelectionAtom)

    const [open, setOpen] = useState(false)
    const [columnFilters, setColumnFilters] = useSelectorReducerAtom(
        columnFiltersAtom,
        columnFilterSelectorReducer(filterName),
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

    const validatedOptions: options = useMemo(() => {
        const sanitizedOptions = z.string().array().safeParse(options)
        if (sanitizedOptions.success) {
            return sanitizedOptions.data.map((option) => ({
                label: option,
                value: option,
            }))
        }
        return options
    }, [options]) as options

    const hasColor = useMemo(
        () => validatedOptions.some((d) => d.color),
        [validatedOptions],
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"secondary"}
                    size={"sm"}
                    className={cn(
                        " font-regular flex h-fit w-fit items-center gap-2  rounded-full px-3 py-1",
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
                    {columnName}
                    {columnFilters.length !== 0 && (
                        <div className="-ml-1 text-xs text-slate-500">
                            {`+${columnFilters.length}`}
                        </div>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className=" w-72 p-0">
                <Command>
                    <CommandInput
                        placeholder={`Search ${columnName.toLowerCase()}...`}
                    />
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
                                    className="flex items-center justify-start gap-2"
                                >
                                    {hasColor &&
                                        (currentValue === "starred" ? (
                                            <Star
                                                size={14}
                                                weight="fill"
                                                className=" -mx-[3px]"
                                                style={{
                                                    color:
                                                        validatedOptions.find(
                                                            (item) =>
                                                                item.value ===
                                                                currentValue,
                                                        )?.color ?? "",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className=" aspect-square w-2 rounded-full bg-slate-500"
                                                style={{
                                                    backgroundColor:
                                                        validatedOptions.find(
                                                            (item) =>
                                                                item.value ===
                                                                currentValue,
                                                        )?.color ?? "",
                                                }}
                                            />
                                        ))}
                                    {
                                        validatedOptions.find(
                                            (item) =>
                                                item.value === currentValue,
                                        )?.label
                                    }
                                </CommandTag>
                            ))}
                        </CommandTagsGroup>
                    )}
                    <CommandList>
                        <CommandEmpty>
                            No {columnName.toLowerCase()} found.
                        </CommandEmpty>

                        <CommandGroup>
                            {validatedOptions
                                .filter(
                                    (filterOption) =>
                                        !columnFilters.includes(
                                            filterOption.value,
                                        ),
                                )
                                .map((filterOption) => (
                                    <CommandItem
                                        key={filterOption.value}
                                        value={filterOption.value}
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
                                        className="flex items-center justify-start gap-2"
                                    >
                                        {hasColor &&
                                            (filterOption.value ===
                                            "starred" ? (
                                                <Star
                                                    size={14}
                                                    weight="fill"
                                                    className=" -mx-[3px]"
                                                    style={{
                                                        color:
                                                            validatedOptions.find(
                                                                (item) =>
                                                                    item.value ===
                                                                    filterOption.value,
                                                            )?.color ?? "",
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className=" aspect-square w-2 rounded-full bg-slate-500"
                                                    style={{
                                                        backgroundColor:
                                                            validatedOptions.find(
                                                                (item) =>
                                                                    item.value ===
                                                                    filterOption.value,
                                                            )?.color ?? "",
                                                    }}
                                                />
                                            ))}
                                        {filterOption.label}
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

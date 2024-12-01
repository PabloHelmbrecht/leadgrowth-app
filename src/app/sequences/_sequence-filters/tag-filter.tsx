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
import { useSelectorReducerAtom } from "~/lib/utils/reducerAtom"

//Icons
import { CaretDown, Star } from "@phosphor-icons/react/dist/ssr"

//Atoms & Jotai
import { useAtom } from "jotai"
import {
  columnFiltersAtom,
  rowSelectionAtom,
  columnFilterSelectorReducer,
} from "~/lib/stores"
import { tagsMockDataAtom } from "~/lib/stores/mockData"

export function TagFilter() {
  //Mock data
  const [tagsMockData] = useAtom(tagsMockDataAtom)
  const [rowSelection] = useAtom(rowSelectionAtom)

  const [open, setOpen] = useState(false)
  const [columnFilters, setColumnFilters] = useSelectorReducerAtom(
    columnFiltersAtom,
    columnFilterSelectorReducer("tag"),
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
            " font-regular flex h-fit w-fit items-center gap-2  rounded-full px-3 py-1",
            Object.keys(rowSelection).length !== 0 && "hidden",
          )}
        >
          <CaretDown
            width={16}
            height={16}
            weight="bold"
            className="aspect-square min-w-4"
            alt={"config sequence button"}
          />
          Tags
          {columnFilters.length !== 0 && (
            <div className="-ml-1 text-xs text-neutral-500">
              {`+${columnFilters.length}`}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" w-72 p-0">
        <Command>
          <CommandInput placeholder="Search tags..." />
          {columnFilters.length !== 0 && (
            <CommandTagsGroup>
              {columnFilters.map((currentValue) => (
                <CommandTag
                  key={currentValue}
                  onClick={() =>
                    setColumnFilters(
                      columnFilters.filter((item) => item !== currentValue),
                    )
                  }
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
                            (item) => item.value === currentValue,
                          )?.color ?? "",
                      }}
                    />
                  ) : (
                    <div
                      className=" aspect-square w-2 rounded-full bg-neutral-500"
                      style={{
                        backgroundColor:
                          tagsMockData.find(
                            (item) => item.value === currentValue,
                          )?.color ?? "",
                      }}
                    />
                  )}
                  {
                    tagsMockData.find((item) => item.value === currentValue)
                      ?.label
                  }
                </CommandTag>
              ))}
            </CommandTagsGroup>
          )}
          <CommandList>
            <CommandEmpty>No tags found.</CommandEmpty>

            <CommandGroup>
              {tagsMockData
                .filter((tag) => !columnFilters.includes(tag.value))
                .map((tag) => (
                  <CommandItem
                    key={tag.value}
                    value={tag.value}
                    onSelect={(currentValue) => {
                      if (!columnFilters.includes(currentValue)) {
                        setColumnFilters([
                          ...new Set([...columnFilters, currentValue]),
                        ])
                      } else {
                        setColumnFilters(
                          columnFilters.filter((item) => item !== currentValue),
                        )
                      }
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
                              (item) => item.value === tag.value,
                            )?.color ?? "",
                        }}
                      />
                    ) : (
                      <div
                        className=" aspect-square w-2 rounded-full bg-neutral-500"
                        style={{
                          backgroundColor:
                            tagsMockData.find(
                              (item) => item.value === tag.value,
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

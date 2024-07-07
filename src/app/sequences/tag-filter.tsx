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
import { cn, eventEmmiter } from "~/lib/utils"

//Icons
import { CaretDown, Star } from "@phosphor-icons/react/dist/ssr"

//Atoms & Jotai
import { useAtom } from "jotai"
import { handlerColumnFiltersAtom, rowSelectionAtom } from "~/lib/store"
import { tagsMockDataAtom } from "~/lib/mockData"

export function TagFilter() {
  //Mock data
  const [tagsMockData] = useAtom(tagsMockDataAtom)
  const [rowSelection] = useAtom(rowSelectionAtom)

  const [open, setOpen] = useState(false)
  const [columnFilters, setColumnFilters] = useAtom(handlerColumnFiltersAtom)

  //Reset filter when button "Reset filters" is clicked
  useEffect(() => {
    const handleEvent = () => {
      setItemSelected([])
    }

    eventEmmiter.on("resetAllFilters", handleEvent)

    return () => {
      eventEmmiter.off("resetAllFilters", handleEvent)
    }
  }, [])

  //BUG: If i use the store directly the values dont update properly
  const [itemSelected, setItemSelected] = useState<string[]>([])
  useEffect(() => {
    setColumnFilters("tag", itemSelected)
  }, [itemSelected, setColumnFilters])
  useEffect(() => {
    setItemSelected(columnFilters("tag"))
  }, [setItemSelected, columnFilters])

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
          {itemSelected.length !== 0 && (
            <div className="-ml-1 text-xs text-neutral-500">
              {`+${itemSelected.length}`}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" w-72 p-0">
        <Command>
          <CommandInput placeholder="Search tags..." />
          {itemSelected.length !== 0 && (
            <CommandTagsGroup>
              {itemSelected.map((currentValue) => (
                <CommandTag
                  key={currentValue}
                  onClick={() =>
                    setItemSelected(
                      itemSelected.filter((item) => item !== currentValue),
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
                .filter((tag) => !itemSelected.includes(tag.value))
                .map((tag) => (
                  <CommandItem
                    key={tag.value}
                    value={tag.value}
                    onSelect={(currentValue) => {
                      if (!itemSelected.includes(currentValue)) {
                        setItemSelected([
                          ...new Set([...itemSelected, currentValue]),
                        ])
                      } else {
                        setItemSelected(
                          itemSelected.filter((item) => item !== currentValue),
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

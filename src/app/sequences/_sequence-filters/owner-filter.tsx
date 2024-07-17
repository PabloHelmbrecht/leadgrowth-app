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
import { CaretDown } from "@phosphor-icons/react/dist/ssr"

//Atoms & Jotai
import { useAtom } from "jotai"
import { handlerColumnFiltersAtom, rowSelectionAtom } from "~/lib/store"
import { ownersMockDataAtom } from "~/lib/mockData"

export function OwnerFilter() {
  //Mock data
  const [ownersMockData] = useAtom(ownersMockDataAtom)
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
    setColumnFilters("owner", itemSelected)
  }, [itemSelected, setColumnFilters])
  useEffect(() => {
    setItemSelected(columnFilters("owner"))
  }, [setItemSelected, columnFilters])

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
            alt={"config sequence button"}
          />
          Owner
          {itemSelected.length !== 0 && (
            <div className="-ml-1 text-xs text-neutral-500">
              {`+${itemSelected.length}`}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" w-72 p-0">
        <Command>
          <CommandInput placeholder="Search owners..." />

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
                >
                  {
                    ownersMockData.find((item) => item.value === currentValue)
                      ?.label
                  }
                </CommandTag>
              ))}
            </CommandTagsGroup>
          )}

          <CommandList>
            <CommandEmpty>No owners found.</CommandEmpty>

            <CommandGroup>
              {ownersMockData
                .filter((owner) => !itemSelected.includes(owner.value))
                .map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
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

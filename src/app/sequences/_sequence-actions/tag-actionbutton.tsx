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
import { rowSelectionAtom } from "~/lib/stores"
import { tagsMockDataAtom, sequencesMockDataAtom } from "~/lib/stores/mockData"

export function TagActionButton() {
  //Mock data
  const [tagsMockData] = useAtom(tagsMockDataAtom)
  const [rowSelection] = useAtom(rowSelectionAtom)
  const [sequenceMockData, setSequencesMockData] = useAtom(
    sequencesMockDataAtom,
  )

  //Get tags of selection
  const tagsSelected = useMemo(() => {
    return sequenceMockData
      .filter((sequence) =>
        Object.keys(rowSelection)
          .filter((id) => rowSelection[id])
          .includes(sequence.id),
      )
      .reduce(
        (allTags: string[], sequence) => [
          ...new Set([...allTags, ...sequence.tag]),
        ],
        [],
      )
  }, [rowSelection, sequenceMockData])

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
            alt={"config sequence button"}
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
                    setSequencesMockData((oldSequencesMockData) =>
                      oldSequencesMockData.map((sequence) => {
                        if (
                          Object.keys(rowSelection)
                            .filter((id) => rowSelection[id])
                            .includes(sequence.id)
                        ) {
                          return {
                            ...sequence,
                            tag: sequence.tag.filter(
                              (tag) => tag !== currentValue,
                            ),
                          }
                        }
                        return sequence
                      }),
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
                .filter((tag) => !tagsSelected.includes(tag.value))

                .map((tag) => (
                  <CommandItem
                    key={tag.value}
                    value={tag.value}
                    onSelect={(currentValue) => {
                      setSequencesMockData((oldSequencesMockData) =>
                        oldSequencesMockData.map((sequence) => {
                          if (
                            Object.keys(rowSelection)
                              .filter((id) => rowSelection[id])
                              .includes(sequence.id)
                          ) {
                            return {
                              ...sequence,
                              tag: [
                                ...new Set([...sequence.tag, currentValue]),
                              ],
                            }
                          }
                          return sequence
                        }),
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

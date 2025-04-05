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
} from "~/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"

//Class Merge
import { cn } from "~/lib/utils/classesMerge"

//Icons
import { User, Check } from "@phosphor-icons/react/dist/ssr"

//Atoms & Jotai
import { useAtom } from "jotai"
import { rowSelectionAtom } from "~/lib/stores/sequence-table"
import {
    ownersMockDataAtom,
    sequencesMockDataAtom,
} from "~/lib/stores/mockData/sequence"

export function OwnerActionButton() {
    //Mock data
    const [ownersMockData] = useAtom(ownersMockDataAtom)
    const [rowSelection] = useAtom(rowSelectionAtom)
    const [sequenceMockData, setSequencesMockData] = useAtom(
        sequencesMockDataAtom,
    )

    const selectedSequences = useMemo(
        () =>
            sequenceMockData.filter((sequence) =>
                Object.keys(rowSelection)
                    .filter((id) => rowSelection[id])
                    .includes(sequence.id),
            ),
        [sequenceMockData, rowSelection],
    )

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"secondary"}
                    size={"sm"}
                    className={cn(
                        " font-regular flex h-fit w-fit items-center gap-2 rounded-full px-3 py-1",
                        Object.keys(rowSelection).length === 0 && "hidden",
                    )}
                >
                    <User
                        width={16}
                        height={16}
                        weight="bold"
                        className="aspect-square min-w-4"
                        alt={"config sequence button"}
                    />
                    Set Owner
                </Button>
            </PopoverTrigger>
            <PopoverContent className=" w-72 p-0">
                <Command>
                    <CommandInput placeholder="Select owner..." />

                    <CommandList>
                        <CommandEmpty>No owners found.</CommandEmpty>

                        <CommandGroup>
                            {ownersMockData.map((owner) => (
                                <CommandItem
                                    key={owner.value}
                                    value={owner.value}
                                    onSelect={(currentValue) => {
                                        setSequencesMockData(
                                            (oldSequencesMockData) =>
                                                oldSequencesMockData.map(
                                                    (sequence) => {
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
                                                                    sequence.id,
                                                                )
                                                        ) {
                                                            return {
                                                                ...sequence,
                                                                owner: currentValue,
                                                            }
                                                        }
                                                        return sequence
                                                    },
                                                ),
                                        )
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedSequences
                                                .map(
                                                    (sequence) =>
                                                        sequence.owner,
                                                )
                                                .includes(owner.value)
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    {owner.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

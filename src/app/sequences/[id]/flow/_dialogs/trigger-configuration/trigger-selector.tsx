//UI
import { Button } from "~/components/ui/button"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "~/components/ui/command"

//Icons
import { CaretUpDown, Check, Trash } from "@phosphor-icons/react/dist/ssr"

//Utils
import { cn } from "~/lib/utils/classesMerge"

//React Hook Form
import { type UseFieldArrayReturn } from "react-hook-form"

//Zod & Schemas
import type { z } from "zod"
import {
    type triggerNodeDataSchema,
    triggerDataSchema,
} from "../../_nodes/trigger-node"

//TAREA: Hacer que al seleccionar un trigger me permita seleccionar los parametros específicos

export function TriggerSelector({
    index,
    triggers,
}: {
    index: number
    triggers: UseFieldArrayReturn<z.infer<typeof triggerNodeDataSchema>>
}) {
    const trigger = triggers.fields[index]

    const { data: triggerData } = triggerDataSchema.safeParse(trigger)

    const triggerEvents: (Partial<z.infer<typeof triggerDataSchema>> & {
        label: string
    })[] = [
        {
            label: "Contact Updated",
            type: "contactUpdated",
            parameters: {
                field: "",
                oldValue: null,
                newValue: null,
            },
        },
        {
            label: "Email Opened",
            type: "emailOpened",
            parameters: {
                sequenceIds: [],
                stepIds: [],
                mailboxIds: [],
            },
        },
        {
            label: "Email Clicked",
            type: "emailClicked",
            parameters: {
                sequenceIds: [],
                stepIds: [],
                mailboxIds: [],
            },
        },
        {
            label: "Email Replied",
            type: "emailReplied",
            parameters: {
                sequenceIds: [],
                stepIds: [],
                mailboxIds: [],
            },
        },
        {
            label: "LinkedIn Connection Accepted",
            type: "linkedinConnectionAccepted",
            parameters: {
                linkedinUserIds: [],
            },
        },
        {
            label: "LinkedIn Message Replied",
            type: "linkedinMessageReplied",
            parameters: {
                linkedinUserIds: [],
            },
        },
        {
            label: "Call Connected",
            type: "callConnected",
            parameters: {
                sequenceIds: [],
                stepIds: [],
            },
        },
        {
            label: "Call Unanswered",
            type: "callUnanswered",
            parameters: {
                sequenceIds: [],
                stepIds: [],
            },
        },
        {
            label: "Call Marked Positive",
            type: "callPositive",
            parameters: {
                sequenceIds: [],
                stepIds: [],
            },
        },
        {
            label: "Meeting Scheduled",
            type: "meetingScheduled",
            parameters: {
                calendarIds: [],
            },
        },
        {
            label: "Meeting Completed",
            type: "meetingCompleted",
            parameters: {
                calendarIds: [],
            },
        },
        {
            label: "Meeting Cancelled",
            type: "meetingCancelled",
            parameters: {
                calendarIds: [],
            },
        },
        {
            label: "Website Visited",
            type: "websiteVisited",
            parameters: {
                websiteIds: [],
                pathIds: [],
            },
        },
        {
            label: "No Interaction for X Days",
            type: "noInteractionForXDays",
            parameters: {
                days: 1,
            },
        },
    ]

    return (
        <div className="flex h-fit  flex-1 flex-row items-center divide-x divide-neutral-300 overflow-clip rounded  border  border-neutral-300 bg-white ">
            <Popover>
                <PopoverTrigger
                    asChild
                    className="h-full w-16  rounded-none border-none px-2  "
                >
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "h-full w-full justify-between py-1.5",
                            !triggerData?.type && "text-muted-foreground",
                        )}
                    >
                        {triggerData?.type
                            ? triggerEvents.find(
                                  (event) => event.type === triggerData?.type,
                              )?.label
                            : "Select event"}
                        <CaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search event..." />
                        <CommandList>
                            <CommandEmpty>No event found.</CommandEmpty>
                            <CommandGroup>
                                {triggerEvents.map(
                                    ({ label, type, parameters }) => (
                                        <CommandItem
                                            value={label}
                                            key={type}
                                            onSelect={() => {
                                                triggers.update(index, {
                                                    ...trigger,
                                                    type,
                                                    parameters,
                                                })
                                            }}
                                        >
                                            {label}
                                            <Check
                                                weight="bold"
                                                className={cn(
                                                    "ml-auto",
                                                    type === triggerData?.type
                                                        ? "opacity-100"
                                                        : "opacity-0",
                                                )}
                                            />
                                        </CommandItem>
                                    ),
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <div
                onClick={() => {
                    triggers.remove(index)
                }}
                className=" flex aspect-square items-center justify-center rounded-none bg-transparent px-2 text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900"
            >
                <Trash weight="bold" />
            </div>
        </div>
    )
}

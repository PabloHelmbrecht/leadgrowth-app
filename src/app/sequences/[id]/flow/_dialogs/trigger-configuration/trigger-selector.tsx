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
import { useFieldArray } from "react-hook-form"

//Zod & Schemas
import type { z } from "zod"
import {
    type triggerNodeDataSchema,
    triggerDataSchema,
} from "../../_nodes/trigger-node"


//TAREA: Hacer que al seleccionar un trigger me permita seleccionar los parametros específicos

export function TriggerSelector({ index }: { index: number }) {
    const triggers = useFieldArray<z.infer<typeof triggerNodeDataSchema>>({
        name: "triggers",
        rules: { minLength: 1 },
    })

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
        <div className="flex flex-row gap-2">
            <Popover>
                <PopoverTrigger
                    asChild
                    className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300 [&>span]:line-clamp-1"
                >
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "w-full justify-between",
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
            <Button
                onClick={() => {
                    triggers.remove(index)
                }}
                className="aspect-square bg-neutral-200 p-1 text-neutral-900 hover:bg-red-500 hover:text-neutral-50"
            >
                <Trash weight="bold" className=" aspect-square w-7" />
            </Button>
        </div>
    )
}

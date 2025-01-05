//React
import { useState } from "react"

//Icons
import {
    Lightning,
    PencilSimple,
    WarningCircle,
} from "@phosphor-icons/react/dist/ssr"

//UI
import { MultiDialogProvider } from "~/components/ui/multi-dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "~/components/ui/tooltip"
import { TriggerConfiguration } from "../_dialogs"

//React Flow
import { type Node, type NodeProps, Position } from "@xyflow/react"

//Handles
import { Handle } from "../_handles/handle"

//Zod
import { z } from "zod"

//Utils
import { cn } from "~/lib/utils/classesMerge"
import { makeList } from "~/lib/utils/formatters"

//Schemas
const type = "trigger"

export const triggerDataSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("manualActivation"),
        parameters: z.object({}),
    }),
    z.object({
        type: z.literal("contactUpdated"),
        parameters: z.object({
            field: z.string(),
            oldValue: z.unknown(),
            newValue: z.unknown(),
        }),
    }),
    z.object({
        type: z.enum(["emailOpened", "emailClicked", "emailReplied"]),
        parameters: z.object({
            sequenceIds: z.unknown().array(),
            stepIds: z.unknown().array(),
            mailboxIds: z.unknown().array(),
        }),
    }),

    z.object({
        type: z.enum(["linkedinConnectionAccepted", "linkedinMessageReplied"]),
        parameters: z.object({
            linkedinUserIds: z.unknown().array(),
        }),
    }),
    z.object({
        type: z.enum(["callConnected", "callUnanswered", "callPositive"]),
        parameters: z.object({
            sequenceIds: z.unknown().array(),
            stepIds: z.unknown().array(),
        }),
    }),
    z.object({
        type: z.enum([
            "meetingScheduled",
            "meetingCompleted",
            "meetingCancelled",
        ]),
        parameters: z.object({
            calendarIds: z.unknown().array(),
        }),
    }),
    z.object({
        type: z.literal("websiteVisited"),
        parameters: z.object({
            websiteIds: z.unknown().array(),
            pathIds: z.unknown().array(),
        }),
    }),
    z.object({
        type: z.literal("noInteractionForXDays"),
        parameters: z.object({
            days: z.number(),
        }),
    }),
])
const triggersDataSchema = triggerDataSchema.array().min(1)
const conjunctionSchema = z.enum(["AND", "OR"])

export const simpleFilterCriteriaDataSchema = z.object({
    type: z.literal("simple"),
    field: z.string(),
    values: z.unknown(),
})

export const groupFilterCriteriaDataSchema = z.object({
    type: z.literal("group"),
    conjunction: conjunctionSchema,
    filters: simpleFilterCriteriaDataSchema.array(),
})

export const filterSchema = z.discriminatedUnion("type", [
    simpleFilterCriteriaDataSchema,
    groupFilterCriteriaDataSchema,
])

export const triggerNodeDataSchema = z.object({
    triggers: triggersDataSchema,
    filterCriteria: z.object({
        conjunction: conjunctionSchema,
        filters: filterSchema.array(),
    }),
})

export type TriggerNode = Node<
    z.infer<typeof triggerNodeDataSchema>,
    typeof type
>
export type Trigger = z.infer<typeof triggerDataSchema>

//Header
function TriggerNodeHeader({
    isComplete,
    nodeId,
}: {
    isComplete: boolean
    nodeId: string
}) {
    enum dialogs {
        Edit = 1,
    }

    const [isHovered, setIsHovered] = useState<boolean>(false)

    const toggleHover = () => setIsHovered(!isHovered)
    return (
        <MultiDialogProvider<dialogs>>
            {({ Trigger, Container }) => (
                <>
                    <Trigger value={dialogs.Edit} variant={"dialog"}>
                        <div
                            className={cn(
                                "  premium-transition relative flex w-full items-center  justify-center gap-2 px-4 py-3 text-white transition-colors  ",
                                isComplete
                                    ? "bg-primary-700 hover:bg-primary-800"
                                    : "bg-danger-400 hover:bg-danger-500  ",
                            )}
                            onMouseEnter={toggleHover}
                            onMouseLeave={toggleHover}
                        >
                            {
                                /* BUG: I had to hardcode the top position of the warning icon to 0.38REM because i had problems with the Tooltip clipping when i applied transform */
                                !isComplete && (
                                    <div className=" absolute right-4 top-[0.64rem] flex-col items-start justify-start ">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <WarningCircle
                                                    className="text-white"
                                                    weight="fill"
                                                    height={24}
                                                    width={24}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <div className=" w-36 text-pretty">
                                                    Complete all the field
                                                    required for this step
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                )
                            }
                            {isHovered ? (
                                <PencilSimple
                                    weight="bold"
                                    width={16}
                                    height={16}
                                    className="aspect-square"
                                />
                            ) : (
                                <Lightning
                                    weight="bold"
                                    width={16}
                                    height={16}
                                    className="aspect-square"
                                />
                            )}
                            <div className=" font-semibold">
                                {isHovered ? "Edit Trigger" : "Trigger"}
                            </div>
                        </div>
                    </Trigger>
                    <Container value={dialogs.Edit} variant={"dialog"}>
                        <TriggerConfiguration nodeId={nodeId} />
                    </Container>
                </>
            )}
        </MultiDialogProvider>
    )
}

//Trigger Components
function getTriggerDescription({
    type,
    parameters,
}: z.infer<typeof triggerDataSchema>): string {
    type ParametersFor<T extends Trigger["type"]> = Extract<
        Trigger,
        { type: T }
    >["parameters"]

    const manualActivationHandler = () => "Contact manually added to sequence."
    const contactUpdatedHandler = (
        parameters: ParametersFor<"contactUpdated">,
    ) => {
        const { field, oldValue, newValue } = parameters
        return `Contact updated: ${field} updated${oldValue ? ` from ${String(oldValue)}` : ""}${newValue ? ` to ${String(newValue)}` : ""}.`
    }
    const emailActionHandler = <
        T extends "emailOpened" | "emailClicked" | "emailReplied",
    >(
        type: T,
        params: ParametersFor<T>,
    ): string => {
        const { sequenceIds = [], stepIds = [], mailboxIds = [] } = params
        const actionMap = {
            emailOpened: "opened",
            emailClicked: "clicked",
            emailReplied: "replied",
        } as const

        return `Contact ${actionMap[type]} email sent${
            mailboxIds.length > 0 ? ` from ${makeList(mailboxIds)}` : ""
        }${
            sequenceIds.length > 0
                ? ` in sequence(s): ${makeList(sequenceIds)}`
                : ""
        }${stepIds.length > 0 ? ` on step(s): ${makeList(stepIds)}` : ""}.`
    }

    const linkedinActionHandler = <
        T extends "linkedinConnectionAccepted" | "linkedinMessageReplied",
    >(
        type: T,
        params: ParametersFor<T>,
    ): string => {
        const { linkedinUserIds = [] } = params
        const actionMap = {
            linkedinConnectionAccepted: "accepted Linkedin connection",
            linkedinMessageReplied: "replied Linkedin message",
        } as const

        return `Contact ${actionMap[type]}${
            linkedinUserIds.length > 0
                ? ` from ${makeList(linkedinUserIds)}`
                : ""
        }.`
    }

    const callActionHandler = <
        T extends "callConnected" | "callUnanswered" | "callPositive",
    >(
        type: T,
        params: ParametersFor<T>,
    ): string => {
        const { sequenceIds = [], stepIds = [] } = params
        const actionMap = {
            callConnected: "answered a call",
            callUnanswered: "did not answered a call",
            callPositive: "responded positively to a call",
        } as const

        return `Contact ${actionMap[type]}${
            sequenceIds.length > 0
                ? ` in sequence(s): ${makeList(sequenceIds)}`
                : ""
        }${stepIds.length > 0 ? ` on step(s): ${makeList(stepIds)}` : ""}.`
    }

    const meetingActionHandler = <
        T extends "meetingScheduled" | "meetingCompleted" | "meetingCancelled",
    >(
        type: T,
        params: ParametersFor<T>,
    ): string => {
        const { calendarIds = [] } = params
        const actionMap = {
            meetingScheduled: "scheduled",
            meetingCompleted: "completed",
            meetingCancelled: "cancelled",
        } as const

        return `Contact ${actionMap[type]} a meeting${
            calendarIds.length > 0
                ? ` on the calendar(s): ${makeList(calendarIds)}`
                : ""
        }.`
    }

    const websiteVisitedHandler = <T extends "websiteVisited">(
        params: ParametersFor<T>,
    ): string => {
        const { websiteIds = [], pathIds = [] } = params

        return `Contact visited the website(s)${
            websiteIds.length > 0 ? `: ${makeList(websiteIds)}` : ""
        }${pathIds.length > 0 ? ` on path(s): ${makeList(pathIds)}` : ""}.`
    }

    const noInteractionForXDaysHandler = <T extends "noInteractionForXDays">(
        params: ParametersFor<T>,
    ): string => {
        const { days } = params
        return `Contact did not interact in ${days} ${days > 1 ? "days" : "day"}.`
    }

    switch (type) {
        case "manualActivation":
            return manualActivationHandler()

        case "contactUpdated":
            return contactUpdatedHandler(parameters)

        case "emailOpened":
        case "emailClicked":
        case "emailReplied":
            return emailActionHandler(type, parameters)

        case "linkedinConnectionAccepted":
        case "linkedinMessageReplied":
            return linkedinActionHandler(type, parameters)

        case "callConnected":
        case "callUnanswered":
        case "callPositive":
            return callActionHandler(type, parameters)

        case "meetingScheduled":
        case "meetingCompleted":
        case "meetingCancelled":
            return meetingActionHandler(type, parameters)

        case "websiteVisited":
            return websiteVisitedHandler(parameters)

        case "noInteractionForXDays":
            return noInteractionForXDaysHandler(parameters)

        default:
            console.error("Trigger type does not exist")
            return ""
    }
}
function TriggersList({
    triggers,
}: {
    triggers: z.infer<typeof triggersDataSchema>
}) {
    return (
        <div className="flex w-full flex-col items-start justify-start gap-4 px-4">
            <div>
                Run the sequence when any of the following events occur...
            </div>
            {triggers && triggers.length > 0 ? (
                triggers.map((trigger, key) => (
                    <div
                        key={key}
                        className="flex w-full flex-col items-start gap-4 rounded-md bg-neutral-100 p-2"
                    >
                        {getTriggerDescription(trigger)}
                    </div>
                ))
            ) : (
                <div className="flex w-full flex-col items-start gap-4 rounded-md bg-neutral-100 p-2 italic">
                    No events assigned.
                </div>
            )}
        </div>
    )
}

//Filter Components

interface IFilter {
    render(): JSX.Element
    setAsChild(): this
}

class SimpleFilter implements IFilter {
    private field: z.infer<typeof simpleFilterCriteriaDataSchema.shape.field>
    private values: z.infer<typeof simpleFilterCriteriaDataSchema.shape.values>
    private isChild: boolean

    constructor({
        field,
        values,
    }: {
        field: z.infer<typeof simpleFilterCriteriaDataSchema.shape.field>
        values: z.infer<typeof simpleFilterCriteriaDataSchema.shape.values>
    }) {
        this.field = field
        this.values = values
        this.isChild = false
    }

    setAsChild(): this {
        this.isChild = true
        return this
    }

    render(): JSX.Element {
        return (
            <div
                className={cn(
                    "flex w-full flex-1 items-start gap-2 rounded-md  p-2",
                    this.isChild ? "bg-neutral-300" : "bg-neutral-100",
                )}
            >
                <div>
                    <span className="flex-initial font-semibold">
                        {this.field}
                    </span>
                    {" is "}
                </div>
                <div className="flex flex-1 flex-wrap items-start justify-start gap-2">
                    <span className="rounded bg-neutral-700 p-1 px-2 text-xs text-white">
                        {String(this.values)}
                    </span>
                </div>
            </div>
        )
    }
}

class GroupFilter implements IFilter {
    private conjunction: z.infer<
        typeof groupFilterCriteriaDataSchema.shape.conjunction
    >
    private children: IFilter[] = []

    constructor({
        conjunction,
        filters,
    }: {
        conjunction: z.infer<
            typeof groupFilterCriteriaDataSchema.shape.conjunction
        >
        filters: z.infer<typeof groupFilterCriteriaDataSchema.shape.filters>
    }) {
        this.conjunction = conjunction
        this.children = filters.map(
            (f) =>
                new SimpleFilter({
                    field: f.field,
                    values: f.values,
                }),
        )
    }

    setAsChild(): this {
        return this
    }

    render(): JSX.Element {
        return (
            <div className="flex w-full flex-1 flex-col items-start gap-2 rounded-md bg-neutral-100 p-2">
                <div className="text-xs italic text-neutral-500">
                    {this.conjunction === "AND"
                        ? "All of the following are true..."
                        : "Any of the following are true..."}
                </div>
                <div className="flex w-full flex-initial flex-row gap-2">
                    <div>where</div>
                    <div className="flex flex-1 flex-col gap-2">
                        {this.children.map((child, key) => (
                            <div key={key}>{child.setAsChild().render()}</div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

function createFilterFromData(
    filter:
        | z.infer<typeof simpleFilterCriteriaDataSchema>
        | z.infer<typeof groupFilterCriteriaDataSchema>,
): IFilter | undefined {
    const { data: filterData } = filterSchema.safeParse(filter)
    if (filterData?.type === "group") {
        return new GroupFilter({
            conjunction: filterData.conjunction,
            filters: filterData.filters,
        })
    }

    if (filterData?.type === "simple") {
        const simple = simpleFilterCriteriaDataSchema.parse(filter)
        return new SimpleFilter({
            field: simple.field,
            values: simple.values,
        })
    }
}

function FiltersCriteriaList({
    filterCriteria,
}: {
    filterCriteria: z.infer<typeof triggerNodeDataSchema.shape.filterCriteria>
}) {
    const { filters, conjunction } = filterCriteria

    return (
        <div className="flex w-full flex-col items-start justify-start gap-4 px-4 ">
            <div>If the following criteria are met...</div>
            {filters.length > 0 ? (
                filters.map((filterData, index) => {
                    const childFilter = createFilterFromData(filterData)
                    return (
                        <div key={index} className="flex w-full flex-row gap-2">
                            <div className="w-12 flex-initial">
                                {index === 0
                                    ? "where"
                                    : conjunction === "AND"
                                      ? "and"
                                      : "or"}
                            </div>
                            <div className="flex-1">
                                {childFilter?.render()}
                            </div>
                        </div>
                    )
                })
            ) : (
                <div className="flex w-full flex-col items-start gap-4 rounded-md bg-neutral-100 p-2 italic">
                    No filters assigned.
                </div>
            )}
        </div>
    )
}


export function TriggerNode({ data, id }: NodeProps<TriggerNode>) {
    const { success: isComplete, error } = triggerNodeDataSchema.safeParse(data)

    if (!isComplete) {
        console.error(error)
    }
    const { filterCriteria, triggers } = data

    return (
        <div
            className={cn(
                "group flex  w-[30rem] flex-col overflow-hidden rounded-xl border-2  text-sm transition-colors group-[.selected]:border-primary-700   ",
                !isComplete &&
                    "danger border-danger-400 group-[.selected]:border-danger-400",
            )}
        >
            <div className=" !z-20 flex flex-col items-center justify-start  !border-none bg-white   ">
                <TriggerNodeHeader isComplete={isComplete} nodeId={id} />

                <div className=" flex w-full flex-col items-start justify-start gap-4 py-4">
                    <TriggersList triggers={triggers} />
                    <div className="w-full border border-neutral-100" />
                    <FiltersCriteriaList filterCriteria={filterCriteria} />
                </div>
            </div>

            <Handle type="source" id={"default"} position={Position.Bottom} />
        </div>
    )
}

"use client"

//React
import { useMemo, useState, type DragEvent } from "react"
//Next JS
import { usePathname } from "next/navigation"

//UI
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"

//Icon
import {
    MagnifyingGlass,
    Envelope,
    UserPlus,
    Eye,
    ThumbsUp,
    ChatCircle,
    Phone,
    CheckSquare,
    ArrowsSplit,
    DiceFive,
    QuestionMark,
    ArrowsClockwise,
    Bell,
    PaperPlaneRight,
    Robot,
} from "@phosphor-icons/react/dist/ssr"
import { type Icon } from "@phosphor-icons/react"

//Utils
import { cn } from "~/lib/utils/classesMerge"

//Types
type block = {
    title: string
    items: {
        icon: Icon
        name: string
        type: string
        queryValue?: string
        bgColor: string
        textColor: string
    }[]
}

//Steps
const emailBlock = {
    title: "Emails",
    items: [
        {
            icon: Robot,
            name: "Automatic Email",
            type: "automaticEmail",
            bgColor: "bg-success-100",
            textColor: "text-success-600",
        },
        {
            icon: Envelope,
            name: "Manual Email",
            type: "manualEmail",
            bgColor: "bg-success-100",
            textColor: "text-success-600",
        },
    ],
}

const linkedinBlock: block = {
    title: "Linkedin",
    items: [
        {
            icon: UserPlus,
            name: "Connection Request",
            queryValue: "Linkedin Connection Request",
            type: "linkedinConnection",
            bgColor: "bg-primary-100",
            textColor: "text-primary-600",
        },
        {
            icon: ChatCircle,
            name: "Linkedin Message",
            type: "linkedinMessage",
            bgColor: "bg-primary-100",
            textColor: "text-primary-600",
        },
        {
            icon: Eye,
            name: "View Profile",
            queryValue: "View Linkedin Profile",
            type: "linkedinViewProfile",
            bgColor: "bg-primary-100",
            textColor: "text-primary-600",
        },
        {
            icon: ThumbsUp,
            name: "Interact With Post",
            queryValue: "Interact With Linkedin Post",
            type: "linkedinPostInteraction",
            bgColor: "bg-primary-100",
            textColor: "text-primary-600",
        },
    ],
}

const callBlock: block = {
    title: "Calls",
    items: [
        {
            icon: Phone,
            name: "Phone Call",
            type: "phoneCall",
            bgColor: "bg-purple-100",
            textColor: "text-purple-600",
        },
    ],
}

const taskBlock: block = {
    title: "Tasks",
    items: [
        {
            icon: CheckSquare,
            name: "Manual Task",
            type: "manualTask",
            bgColor: "bg-amber-100",
            textColor: "text-amber-600",
        },
    ],
}

const flowBlock: block = {
    title: "Flow Control",
    items: [
        {
            icon: DiceFive,
            name: "Testing A/B",
            type: "testingAB",
            bgColor: "bg-neutral-100",
            textColor: "text-neutral-600",
        },
        {
            icon: QuestionMark,
            name: "Conditional",
            type: "conditional",
            bgColor: "bg-neutral-100",
            textColor: "text-neutral-600",
        },
        {
            icon: ArrowsSplit,
            name: "Splitter",
            type: "splitter",
            bgColor: "bg-neutral-100",
            textColor: "text-neutral-600",
        },
    ],
}

const internalActionsBlock: block = {
    title: "Internal Actions",
    items: [
        {
            icon: Envelope,
            name: "Internal Email",
            type: "internalEmail",
            bgColor: "bg-rose-100",
            textColor: "text-rose-600",
        },
        {
            icon: ArrowsClockwise,
            name: "Update Field",
            type: "updateField",
            bgColor: "bg-rose-100",
            textColor: "text-rose-600",
        },
        {
            icon: Bell,
            name: "App Notification",
            type: "appNotification",
            bgColor: "bg-rose-100",
            textColor: "text-rose-600",
        },
        {
            icon: PaperPlaneRight,
            name: "Manage Workflows",
            type: "manageWorkflows",
            bgColor: "bg-rose-100",
            textColor: "text-rose-600",
        },
    ],
}

const stepsStructure: block[] = [
    emailBlock,
    callBlock,
    taskBlock,
    linkedinBlock,
    internalActionsBlock,
    flowBlock,
]

export function FlowSideBar({}: React.HTMLAttributes<HTMLDivElement>) {
    const pathname = usePathname()

    const [flowSidebarQuery, setFlowSidebarQuery] = useState("")

    if (!pathname.endsWith("/flow")) return <></>

    return (
        <div className="flex w-64 flex-initial flex-col gap-4 bg-white p-8 pr-5">
            <div className="flex flex-col gap-3 pr-3">
                <h2 className=" text-lg font-semibold">Choose a Step</h2>
                <div className="relative flex w-full items-center">
                    <Input
                        placeholder="Search steps..."
                        className="w-full pl-10  focus-visible:outline-0 focus-visible:ring-0"
                        onChange={(e) => setFlowSidebarQuery(e.target.value)}
                    />
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 transform opacity-50 " />
                </div>
            </div>
            <div className="scroll flex h-fit w-full flex-col overflow-auto pr-1  ">
                {stepsStructure.map((block, key) => (
                    <StepBlock key={key} {...block} />
                ))}
            </div>
        </div>
    )

    function StepBlock({ title, items }: block) {
        const filteredItems = useMemo(
            () =>
                items.filter((item) => {
                    if (item.queryValue) {
                        return item.queryValue
                            .toLowerCase()
                            .includes(flowSidebarQuery.toLowerCase())
                    }
                    return item.name
                        .toLowerCase()
                        .includes(flowSidebarQuery.toLowerCase())
                }),
            [items],
        )

        if (filteredItems.length === 0) return
        return (
            <div className="flex w-full flex-1 flex-col gap-2  py-3 ">
                <div className="text-sm font-semibold">{title}</div>
                <div className="flex flex-col gap-3">
                    {filteredItems.map((item, key) => (
                        <Button
                            asChild
                            key={key}
                            variant={"step"}
                            onDragStart={(event) =>
                                onDragStart(event, item.type)
                            }
                            className=" flex w-full cursor-move flex-row items-center !justify-start gap-2 px-2 opacity-[0.999]"
                            draggable
                        >
                            <div>
                                <div
                                    className={cn(
                                        "aspect-square h-fit w-fit flex-initial rounded-md bg-success-100  p-1  text-success-600",
                                        item.textColor,
                                        item.bgColor,
                                    )}
                                >
                                    <item.icon
                                        weight="bold"
                                        width={16}
                                        height={16}
                                        className="aspect-square"
                                    />
                                </div>

                                {item.name}
                            </div>
                        </Button>
                    ))}
                </div>
            </div>
        )
    }
}

function onDragStart(event: DragEvent<HTMLButtonElement>, nodeType: string) {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
}

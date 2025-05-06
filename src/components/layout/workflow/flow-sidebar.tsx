"use client"

//React
import { useMemo, useState, type DragEvent } from "react"
//Next JS
import { usePathname } from "next/navigation"

//UI
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"

//Constants
import {
    flowActionsBlocks,
    type flowActionBlock,
} from "~/lib/constants/flow-actions"

//Icon
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr"

//UI
import { Separator } from "~/components/ui/separator"

export function FlowSideBar({}: React.HTMLAttributes<HTMLDivElement>) {
    const pathname = usePathname()

    const [flowSidebarQuery, setFlowSidebarQuery] = useState("")

    if (!pathname.endsWith("/flow")) return <></>

    return (
        <>
            <Separator orientation="vertical" className="h-full" />
            <div className="flex w-64 flex-initial flex-col gap-4 bg-white p-8 pr-5">
                <div className="flex flex-col gap-3 pr-3">
                    <h2 className=" text-lg font-semibold">Choose a Step</h2>
                    <div className="relative flex w-full items-center">
                        <Input
                            placeholder="Search steps..."
                            className="w-full pl-10  focus-visible:outline-0 focus-visible:ring-0"
                            onChange={(e) =>
                                setFlowSidebarQuery(e.target.value)
                            }
                        />
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 transform opacity-50 " />
                    </div>
                </div>
                <div className="scroll flex  w-full flex-col overflow-auto pr-1  ">
                    {flowActionsBlocks.map((block, key) => (
                        <StepBlock key={key} {...block} />
                    ))}
                </div>
            </div>
        </>
    )

    function StepBlock({ title, items }: flowActionBlock) {
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
                                    className={
                                        "aspect-square h-fit w-fit flex-initial rounded-md bg-neutral-100  p-1  text-neutral-600"
                                    }
                                    style={{
                                        color: item.textColor,
                                        backgroundColor: item.bgColor,
                                    }}
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

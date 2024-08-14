"use client"

//React
import { type DragEvent } from "react"
//Next JS
import { usePathname } from "next/navigation"

//UI
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"

//Icon
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr"
import { type Icon } from "@phosphor-icons/react"

//Steps

const prospectBlock = {
  title: "Emails",
  items: [
    { icon: MagnifyingGlass, name: "Search", type: "custom" },
    { icon: MagnifyingGlass, name: "Enrich", type: "custom" },
  ],
}

const engageBlock = {
  title: "Linkedin",
  items: [
    { icon: MagnifyingGlass, name: "Sequences", type: "custom" },
    { icon: MagnifyingGlass, name: "Emails", type: "custom" },
    { icon: MagnifyingGlass, name: "Linkedin", type: "custom" },
    { icon: MagnifyingGlass, name: "Calls", type: "custom" },
    { icon: MagnifyingGlass, name: "Tasks", type: "custom" },
  ],
}

const analyzeBlock = {
  title: "Calls",
  items: [{ icon: MagnifyingGlass, name: "Performance", type: "custom" }],
}

const stepsStructure = [prospectBlock, engageBlock, analyzeBlock]

export function FlowSideBar({}: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()

  if (!pathname.endsWith("/flow")) return <></>

  return (
    <div className="flex w-64 flex-initial flex-col gap-4 bg-white p-8">
      <div className="flex flex-col gap-3">
        <h2 className=" text-lg font-semibold">Choose a Step</h2>
        <div className="relative flex w-full items-center">
          <Input
            placeholder="Search steps..."
            className="w-full pl-10  focus-visible:outline-0 focus-visible:ring-0"
          />
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 transform opacity-50" />
        </div>
      </div>
      <div className="flex w-full flex-col">
        {stepsStructure.map((block, key) => (
          <StepBlock key={key} {...block} />
        ))}
      </div>
    </div>
  )
}

function onDragStart(event: DragEvent<HTMLButtonElement>, nodeType: string) {
  event.dataTransfer.setData("application/reactflow", nodeType)
  event.dataTransfer.effectAllowed = "move"
}

function StepBlock({
  title,
  items,
}: {
  title?: string
  items: { icon: Icon; name: string; type: string }[]
}) {
  return (
    <div className="flex w-full flex-1 flex-col gap-2  py-4 ">
      <div className="text-sm font-semibold">{title}</div>
      <div className="flex flex-col gap-3">
        {items.map((item, key) => (
          <Button
            asChild
            key={key}
            variant={"step"}
            onDragStart={(event) => onDragStart(event, "custom")}
            className=" flex w-full cursor-move flex-row items-center !justify-start gap-2 px-2 opacity-[0.999]"
            draggable
          >
            <div>
              <div className="aspect-square h-fit w-fit flex-initial rounded-md bg-success-100 p-1 text-success-600">
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

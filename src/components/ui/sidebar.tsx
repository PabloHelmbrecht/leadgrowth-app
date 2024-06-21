"use client"

//Next
import Image from "next/image"
import { usePathname } from "next/navigation"
import Link from "next/link"

//UI
import { Button } from "~/components/ui/button"

//Class Variance
import { cn } from "~/lib/utils"

//Icons
import { type Icon } from "@phosphor-icons/react"
import {
  House,
  MagnifyingGlass,
  CalendarBlank,
  PaperPlaneRight,
  EnvelopeSimple,
  LinkedinLogo,
  Phone,
  CheckSquare,
  TrendUp,
  Lightbulb,
} from "@phosphor-icons/react/dist/ssr"

//Structure of sidebar
const homeBlock = {
  items: [{ icon: House, name: "Home", path: "/" }],
}

const prospectBlock = {
  title: "Prospect",
  items: [
    { icon: MagnifyingGlass, name: "Search", path: "/search" },
    { icon: CalendarBlank, name: "Enrich", path: "/enrich" },
  ],
}

const engageBlock = {
  title: "Engage",
  items: [
    { icon: PaperPlaneRight, name: "Sequences", path: "/sequences" },
    { icon: EnvelopeSimple, name: "Emails", path: "/emails" },
    { icon: LinkedinLogo, name: "Linkedin", path: "/linkedin" },
    { icon: Phone, name: "Calls", path: "/calls" },
    { icon: CheckSquare, name: "Tasks", path: "/tasks" },
  ],
}

const analyzeBlock = {
  title: "Analyze",
  items: [
    { icon: Lightbulb, name: "Performance", path: "/performance" },
    { icon: TrendUp, name: "Insights", path: "/insights" },
  ],
}

const sidebarStructure = [homeBlock, prospectBlock, engageBlock, analyzeBlock]

function Sidebar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex w-full max-w-56 flex-col items-start gap-8 bg-white px-4 py-8",
        className,
      )}
      {...props}
    >
      <div className="w-full px-4">
        <Image
          src="/logo/isologo.png"
          alt={"Lead Growth logo"}
          width={40}
          height={40}
        />
      </div>

      <div className="flex w-full flex-col divide-y divide-neutral-200">
        {sidebarStructure.map((block, key) => (
          <SidebarBlock key={key} {...block} />
        ))}
      </div>
    </div>
  )
}

function SidebarBlock({
  title,
  items,
}: {
  title?: string
  items: { icon: Icon; name: string; path: string }[]
}) {
  const pathname = usePathname()
  return (
    <div className="flex w-full flex-col gap-2  py-4 first:pt-0 last:pb-0">
      <div className=" px-4 text-sm font-bold ">{title}</div>
      <div className="flex flex-col gap-2">
        {items.map((item, key) => (
          <Link href={item.path} key={key}>
            <Button
              variant={item.path === pathname ? "active" : "ghost"}
              className="flex w-full flex-row items-center justify-start gap-4"
            >
              <item.icon
                width={24}
                height={24}
                weight="bold"
                alt="sidebar menu icon"
              />
              {item.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}

export { Sidebar }

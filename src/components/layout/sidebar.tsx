"use client"

//Next
import Image from "next/image"
import { usePathname } from "next/navigation"
import Link from "next/link"

//UI
import { Button } from "~/components/ui/button"

//Class Merge
import { cn } from "~/lib/utils/classesMerge"

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

//Atoms & Jotai
import { useAtom } from "jotai"
import { sideBarAtom } from "~/lib/stores"

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
        {
            icon: PaperPlaneRight,
            name: "Sequences",
            path: "/sequences",
        },
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
    className: className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    const [isOpen] = useAtom(sideBarAtom)

    return (
        <div
            className={cn(
                "premium-transition flex  h-screen max-w-48 flex-col items-start gap-8 bg-white  py-6",
                className,
                isOpen ? "w-56 min-w-48  px-4 " : "  w-20 px-3 ",
            )}
            {...props}
        >
            <div
                className={cn(
                    "w-full ",
                    isOpen ? "px-3" : "flex items-center justify-center",
                )}
            >
                <Image
                    src={isOpen ? "/logo/logo_short.png" : "/logo/isologo.png"}
                    alt={"Lead Growth logo"}
                    className={cn(
                        "aspect-auto h-8 min-h-8 w-auto",
                        isOpen ? "min-w-[102.4px]" : "min-w-[32px]",
                    )}
                    width={isOpen ? 102.4 : 32}
                    height={32}
                    priority
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
    const [isOpen] = useAtom(sideBarAtom)

    const pathname = usePathname()

    const isPath = (path: string): boolean => {
        if (path === "/") return path === pathname

        return pathname.startsWith(path)
    }

    return (
        <div className="flex w-full flex-1 flex-col gap-2  py-4 first:pt-0 last:pb-0 ">
            {isOpen && (
                <div className=" px-4 text-sm font-semibold ">{title}</div>
            )}
            <div className="flex flex-col gap-2">
                {items.map((item, key) => (
                    <Link
                        href={item.path}
                        key={key}
                        className="flex justify-center"
                    >
                        <Button
                            variant={isPath(item.path) ? "terciary" : "ghost"}
                            size={"sm"}
                            className={cn(
                                "flex w-full flex-row flex-wrap items-center gap-3 overflow-hidden",
                                isOpen
                                    ? "justify-start"
                                    : " h-fit w-fit justify-center p-2",
                            )}
                        >
                            <item.icon
                                width={20}
                                height={20}
                                weight="bold"
                                className="aspect-square min-w-5"
                                alt={item.name}
                            />
                            {isOpen && item.name}
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export { Sidebar }

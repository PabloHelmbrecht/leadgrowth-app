"use client"

//Next JS
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

//Class Merge
import { cn } from "~/lib/utils/classesMerge"

//UI
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import { TriggerAndBreadcrumb } from "~/components/layout/nav-sidebar/trigger-breadcrumb"

//Icons
import {
    PaperPlaneRight,
    Users,
    CheckSquare,
    Newspaper,
    Gear,
} from "@phosphor-icons/react/dist/ssr"

const actionButtons = [
    { icon: PaperPlaneRight, name: "Flow", subPath: "/flow" },
    { icon: Users, name: "Contacts", subPath: "/contacts" },
    { icon: CheckSquare, name: "Tasks", subPath: "/tasks" },
    { icon: Newspaper, name: "Actions", subPath: "/actions" },
    { icon: Gear, name: "Settings", subPath: "#" },
]

export function TopMenu({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const { id: workflowId } = useParams<{ id: string }>()
    const pathname = usePathname()

    return (
        <>
            <header
                className="flex h-16  flex-none shrink-0 items-center justify-between gap-2 px-6 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
                {...props}
            >
                <TriggerAndBreadcrumb
                    block="Engage"
                    link="/"
                    page="Workflows"
                />

                <div className="flex gap-4">
                    {actionButtons.map((actionButton, key) => (
                        <Link
                            href={`/${workflowId}${actionButton.subPath}`}
                            key={key}
                            className="flex justify-center"
                        >
                            <Button
                                variant={
                                    pathname.startsWith(
                                        `/${workflowId}${actionButton.subPath}`,
                                    )
                                        ? "terciary"
                                        : "ghost"
                                }
                                size={"sm"}
                                className={cn(
                                    " font-regular flex h-fit w-fit items-center gap-2  rounded-full px-3 py-1",
                                )}
                            >
                                <actionButton.icon
                                    width={16}
                                    height={16}
                                    weight="bold"
                                    className="aspect-square min-w-4"
                                    alt={actionButton.name}
                                />
                                {actionButton.name}
                            </Button>
                        </Link>
                    ))}
                </div>
            </header>
            <Separator orientation="horizontal" className="flex-none" />
        </>
    )
}

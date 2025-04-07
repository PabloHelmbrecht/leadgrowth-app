"use client"

//Next JS
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

//Class Merge
import { cn } from "~/lib/utils/classesMerge"

//UI
import { Button } from "~/components/ui/button"

//Icons
import {
    CaretLeft,
    PaperPlaneRight,
    Users,
    CheckSquare,
    Newspaper,
    Gear,
} from "@phosphor-icons/react/dist/ssr"

//Zod & Schemas
import { z } from "zod"
import { workflowSchema } from "~/lib/stores/mockData/workflow"

const actionButtons = [
    { icon: PaperPlaneRight, name: "Flow", subPath: "/flow" },
    { icon: Users, name: "Contacts", subPath: "/contacts" },
    { icon: CheckSquare, name: "Tasks", subPath: "/tasks" },
    { icon: Newspaper, name: "Actions", subPath: "/actions" },
    { icon: Gear, name: "Settings", subPath: "/settings" },
]

export function TopMenu({
    className: className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    const paramSchema = z.object({ id: workflowSchema.shape.id })

    const { id } = useParams<z.infer<typeof paramSchema>>()
    const pathname = usePathname()

    return (
        <div
            className={cn(
                "relative flex flex-initial flex-row items-center justify-between bg-white px-8 py-4",
                className,
            )}
            {...props}
        >
            <Link href={"/workflows"}>
                <Button
                    variant={"secondary"}
                    size={"sm"}
                    className={cn(
                        " font-regular flex h-fit w-fit items-center gap-2  rounded-full px-3 py-1 ",
                    )}
                >
                    <CaretLeft
                        width={16}
                        height={16}
                        weight="bold"
                        className="aspect-square min-w-4"
                        alt={"return to workflow button"}
                    />
                    Return to workflows
                </Button>
            </Link>

            <div className="flex gap-4">
                {actionButtons.map((actionButton, key) => (
                    <Link
                        href={`/workflows/${id}${actionButton.subPath}`}
                        key={key}
                        className="flex justify-center"
                    >
                        <Button
                            variant={
                                pathname.startsWith(
                                    `/workflows/${id}${actionButton.subPath}`,
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
        </div>
    )
}

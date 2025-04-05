//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//Types
import { type Contact } from "~/lib/stores/mockData/contact"

//Utils
import { cn } from "~/lib/utils/classesMerge"

export function BadgesColumn({ row }: CellContext<Contact, unknown>) {
    const statusDictionary = {
        active: {
            tag: "Active",
            color: "bg-primary-100 text-primary-800",
        },
        paused: {
            tag: "Paused",
            color: "bg-neutral-100 text-neutral-800",
        },
        unsubscribed: {
            tag: "Unsubscribed",
            color: "bg-danger-100 text-danger-800",
        },
        bounced: {
            tag: "Bounced",
            color: "bg-danger-100 text-danger-800",
        },
        spam: {
            tag: "Spam",
            color: "bg-danger-100 text-danger-800",
        },
        finished: {
            tag: "Finished",
            color: "bg-success-100 text-success-800",
        },
    }
    return (
        <div className="flex flex-row items-center gap-4">
            <div
                className={cn(
                    "flex min-w-20 flex-row items-center  justify-center rounded-md px-2 py-1 text-xs font-semibold text-white",
                    statusDictionary[row.original.status].color,
                )}
            >
                {statusDictionary[row.original.status].tag}
            </div>
            <div
                className={
                    "flex min-w-20 flex-row items-center  justify-center rounded-md bg-neutral-500 px-2 py-1 text-xs font-semibold text-white"
                }
            >
                Step {row.original.step}
            </div>
            <div
                className={
                    "flex min-w-20 flex-row  items-center justify-center rounded-md bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-800"
                }
            >
                {row.original.stage}
            </div>
        </div>
    )
}

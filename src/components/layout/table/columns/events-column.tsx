//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//Icons
import {
    Eye,
    CursorClick,
    ChatCircleDots,
} from "@phosphor-icons/react/dist/ssr"

//Types
import { type Tables } from "~/lib/supabase/database.types"
//Utils
import { cn } from "~/lib/utils/classesMerge"

export function EventsColumn<Entity extends { events: Tables<"events">[] }>({
    row,
}: CellContext<Entity, unknown>) {
    const isEmailOpenedByContact = row.original.events.some(
        (e) => e.type === "emailOpened",
    )
    const isEmailClickedByContact = row.original.events.some(
        (e) => e.type === "emailClicked",
    )
    const hasContactRepliedByEmail = row.original.events.some(
        (e) => e.type === "emailReplied",
    )

    return (
        <div className="flex flex-row items-center gap-2">
            <div
                className={cn(
                    " relative flex aspect-square flex-row items-center justify-center rounded-md text-xs font-semibold",
                    isEmailOpenedByContact
                        ? "bg-success-100 text-success-800"
                        : "bg-neutral-100 text-neutral-400",
                )}
            >
                <Eye
                    className="aspect-square min-w-6"
                    height={16}
                    width={16}
                    weight="bold"
                />
                {isEmailOpenedByContact || (
                    <div className=" absolute h-4 w-[1.5px] -rotate-45 rounded-full bg-neutral-400" />
                )}
            </div>
            <div
                className={cn(
                    " relative flex aspect-square flex-row items-center justify-center rounded-md text-xs font-semibold",
                    isEmailClickedByContact
                        ? "bg-success-100 text-success-800"
                        : "bg-neutral-100 text-neutral-400",
                )}
            >
                <CursorClick
                    className="aspect-square min-w-6 rotate-90"
                    height={16}
                    width={16}
                    weight="bold"
                />
                {isEmailClickedByContact || (
                    <div className=" absolute h-4 w-[1.5px] -rotate-45 rounded-full bg-neutral-400" />
                )}
            </div>

            <div
                className={cn(
                    " relative flex aspect-square flex-row items-center justify-center rounded-md text-xs font-semibold",
                    hasContactRepliedByEmail
                        ? "bg-success-100 text-success-800"
                        : "bg-neutral-100 text-neutral-400",
                )}
            >
                <ChatCircleDots
                    className="aspect-square min-w-6"
                    height={16}
                    width={16}
                    weight="bold"
                />
                {hasContactRepliedByEmail || (
                    <div className=" absolute h-4 w-[1.5px] -rotate-45 rounded-full bg-neutral-400" />
                )}
            </div>
        </div>
    )
}

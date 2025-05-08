import { type Tables } from "~/lib/supabase/database.types"
import { type CellContext } from "@tanstack/react-table"

interface ContactNameData {
    contact: Tables<"contacts"> | null
    company: Tables<"companies"> | null
}

export function NameColumn<Entity extends ContactNameData>({
    row,
}: CellContext<Entity, unknown>) {
    const data = row.original
    if (!data) return null
    return (
        <div className="flex h-full flex-1 flex-col items-start justify-start gap-1 overflow-clip whitespace-nowrap pl-2 font-semibold">
            {data.contact?.first_name} {data.contact?.last_name}
            <div className="text-xs font-normal">
                {data.contact?.title} in{" "}
                <span className="font-semibold">{data.company?.name}</span>
            </div>
        </div>
    )
}

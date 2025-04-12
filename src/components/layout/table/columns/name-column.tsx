//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

interface ContactNameData {
    firstName: string
    lastName: string
    title: string
    company: string
}

export function NameColumn<
    Entity extends ContactNameData | { contact: ContactNameData },
>({ row }: CellContext<Entity, unknown>) {
    const data: ContactNameData =
        "contact" in row.original ? row.original.contact : row.original
    return (
        <div className="flex h-full flex-1 flex-col items-start justify-start gap-2 overflow-clip whitespace-nowrap pl-2 font-semibold">
            {data.firstName} {data.lastName}
            <div className="text-xs font-normal">
                {data.title} in{" "}
                <span className="font-semibold">{data.company}</span>
            </div>
        </div>
    )
}

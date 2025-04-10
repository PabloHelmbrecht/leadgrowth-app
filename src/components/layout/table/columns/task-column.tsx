//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

export function TaskColumn<Entity extends {firstName: string, lastName: string, title: string, company: string}>({ row }: CellContext<Entity, unknown>) {
    return (
        <div className="flex h-full flex-1 flex-col items-start justify-start gap-2 overflow-clip whitespace-nowrap pl-2 font-semibold">
            {row.original.firstName} {row.original.lastName}
            <div className="text-xs font-normal">
                {row.original.title} in{" "}
                <span className="font-semibold">{row.original.company}</span>
            </div>
        </div>
    )
}

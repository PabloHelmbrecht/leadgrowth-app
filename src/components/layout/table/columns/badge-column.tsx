//Tanstack Table
import { type CellContext } from "@tanstack/react-table"
//Utils
import { cn } from "~/lib/utils/classesMerge"

export function BadgeColumn<Entity>({
    className,
    cell,
    label,
    style,
}: CellContext<Entity, unknown> & {
    className?: string
    label?: string
    style?: React.CSSProperties
}) {
    return (
        <div className="flex flex-row items-center gap-4">
            <div
                className={cn(
                    "flex min-w-20 flex-row items-center  justify-center rounded-md px-2 py-1 text-xs font-semibold text-white",
                    className,
                )}
                style={style}
            >
                {label ?? String(cell.getValue())}
            </div>
        </div>
    )
}

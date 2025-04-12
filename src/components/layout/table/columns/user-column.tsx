//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//Types
import type { User } from "~/lib/stores/mockData/users"

export function UserColumn<Entity extends User | { user: User }>({
    row,
}: CellContext<Entity, unknown>) {
    const user: User = "user" in row.original ? row.original.user : row.original

    return (
        <div className="flex aspect-square h-fit w-fit items-center justify-center rounded-full bg-neutral-100 p-3 text-xs font-semibold text-neutral-800">
            {`${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`}
        </div>
    )
}

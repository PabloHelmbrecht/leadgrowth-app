//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//UI
import { Switch } from "~/components/ui/switch"

//Types
import { type Workflow as Workflow } from "~/lib/hooks/use-workflows"

//Hooks
import { useWorkflows } from "~/lib/hooks/use-workflows"
export function StatusColumn({ row }: CellContext<Workflow, unknown>) {
    const { update } = useWorkflows({ workflowId: row.id })

    return (
        <Switch
            className={
                row.original.status === "archived"
                    ? "data-[state=unchecked]:bg-danger-300"
                    : ""
            }
            disabled={row.original.status === "archived"}
            checked={row.original.status === "active"}
            onCheckedChange={async (value) => {
                if (value) {
                    await update({ status: "active" })
                    return
                }

                await update({ status: "paused" })
            }}
        />
    )
}

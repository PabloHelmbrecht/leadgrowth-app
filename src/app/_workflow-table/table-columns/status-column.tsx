//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//UI
import { Switch } from "~/components/ui/switch"

//Zod & Schemas & Types
import { type Workflow } from "~/lib/stores/mockData/workflow"

//Jotai & Atoms
import { workflowsMockDataAtom } from "~/lib/stores/mockData/workflow"
import {
    useSelectorReducerAtom,
    uniqueSelectorReducer,
} from "~/lib/hooks/use-selector-reducer-atom"

export function StatusColumn({ row }: CellContext<Workflow, unknown>) {
    const [, setWorkflow] = useSelectorReducerAtom(
        workflowsMockDataAtom,
        uniqueSelectorReducer<Workflow>(row.id),
    )
    return (
        <Switch
            className={
                row.getValue("status") === "archived"
                    ? "data-[state=unchecked]:bg-danger-300"
                    : ""
            }
            disabled={row.getValue("status") === "archived"}
            checked={row.getValue("status") === "active"}
            onCheckedChange={(value) => {
                if (value) {
                    setWorkflow((item) => ({ ...item, status: "active" }))
                    return
                }

                setWorkflow((item) => ({ ...item, status: "paused" }))
            }}
        />
    )
}

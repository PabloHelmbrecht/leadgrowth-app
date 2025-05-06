//React
import { useMemo } from "react"

//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//Constants
import { flowActionMap } from "~/lib/constants/flow-actions"

//Icons
import {
    QuestionMark,
    Check,
    SkipForward,
} from "@phosphor-icons/react/dist/ssr"

//Types
import { type Action } from "~/lib/stores/mockData/actions"

//Jotai & Atoms
import { actionsMockDataAtom } from "~/lib/stores/mockData/actions"
import {
    useSelectorReducerAtom,
    uniqueSelectorReducer,
} from "~/lib/hooks/use-selector-reducer-atom"

export function TaskColumn<Entity extends Action>({
    cell,
    row,
}: CellContext<Entity, unknown>) {
    const flowAction = flowActionMap.get(String(cell.getValue()))

    const action = row.original

    const workflowstep = useMemo(
        () =>
            action.workflow.flow.nodes.findIndex(
                ({ id }) => id === action.node_id,
            ),
        [action.workflow, action.node_id],
    )

    const iconSize = 24
    const buttonSize = 20

    const [, setAction] = useSelectorReducerAtom(
        actionsMockDataAtom,
        uniqueSelectorReducer<Action>(action.id),
    )

    const isPendingTask = action.status === "scheduled"

    return (
        <div className="group relative flex flex-row items-center justify-between gap-4 ">
            <div className="flex flex-row items-stretch gap-2">
                <div
                    className={
                        "aspect-square h-fit w-fit flex-initial rounded-md bg-slate-100 p-2 text-slate-800"
                    }
                    style={{
                        color: flowAction?.textColor,
                        backgroundColor: flowAction?.bgColor,
                    }}
                >
                    {flowAction?.icon ? (
                        <flowAction.icon
                            weight="bold"
                            width={iconSize}
                            height={iconSize}
                            className="aspect-square"
                        />
                    ) : (
                        <QuestionMark
                            weight="bold"
                            width={iconSize}
                            height={iconSize}
                            className="aspect-square"
                        />
                    )}
                </div>

                <div className="flex h-full flex-1 flex-col items-start justify-start gap-1 overflow-clip whitespace-nowrap pl-2">
                    {flowAction?.name ?? "Execute task"}

                    <span className="text-xs  font-semibold">
                        {`Step #${workflowstep}`}
                    </span>
                </div>
            </div>

            {isPendingTask && (
                <div className=" absolute  right-2  top-1/2 hidden -translate-y-1/2 transform flex-row items-center divide-x overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm group-hover:flex ">
                    <button
                        className="h-fit w-fit rounded-none p-2  hover:bg-slate-100 hover:text-slate-900"
                        onClick={() =>
                            setAction((action) => ({
                                ...action,
                                completed_at: new Date(),
                                status: "completed",
                            }))
                        }
                    >
                        <Check
                            weight="bold"
                            width={buttonSize}
                            height={buttonSize}
                            className="aspect-square"
                        />
                    </button>
                    <button
                        className="h-fit w-fit rounded-none p-2  hover:bg-slate-100 hover:text-slate-900"
                        onClick={() =>
                            setAction((action) => ({
                                ...action,
                                skipped_at: new Date(),
                                status: "skipped",
                            }))
                        }
                    >
                        <SkipForward
                            weight="bold"
                            width={buttonSize}
                            height={buttonSize}
                            className="aspect-square"
                        />
                    </button>
                </div>
            )}
        </div>
    )
}

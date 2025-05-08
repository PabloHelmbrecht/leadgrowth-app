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
import { type Action, useActions } from "~/lib/hooks/use-actions"

export function TaskColumn<Entity extends Action>({
    row,
}: CellContext<Entity, unknown>) {
    const action = row.original

    const { setStatus } = useActions({
        actionId: row.original.id,
    })

    if (!action.type) return null

    const flowAction = flowActionMap.get(action.type)

    const iconSize = 14
    const buttonSize = 16

    const isPendingTask = action.status === "pending"

    return (
        <div className="relative flex flex-row items-center justify-between gap-4 ">
            <div className="flex flex-row items-center gap-2 rounded-md bg-neutral-100 p-1">
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

                <div className="flex h-full flex-1 flex-col items-start justify-start gap-1 overflow-clip whitespace-nowrap pr-1 font-medium">
                    {flowAction?.name ?? action.type}
                </div>
            </div>

            {isPendingTask && (
                <div className=" absolute  right-2  top-1/2 hidden -translate-y-1/2 transform flex-row items-center divide-x overflow-hidden  rounded-md border bg-white text-slate-800 group-hover/row:flex">
                    <button
                        className="h-fit w-fit rounded-none p-2  hover:bg-slate-100 hover:text-slate-900"
                        onClick={() =>
                            setStatus({
                                status: "completed",
                            })
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
                            setStatus({
                                status: "skipped",
                            })
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

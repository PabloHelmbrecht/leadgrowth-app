import { type CellContext } from "@tanstack/react-table"

//UI
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { ToastAction } from "~/components/ui/toast"
import { useToast } from "~/components/ui/use-toast"

//Zod & Schemas & Types
import { type Workflow } from "~/lib/stores/mockData/workflow"

//Jotai & Atoms
import { workflowsMockDataAtom } from "~/lib/stores/mockData/workflow"
import {
    useSelectorReducerAtom,
    uniqueSelectorReducer,
} from "~/lib/hooks/use-selector-reducer-atom"

export function ArchiveWorkflowAction({ row }: CellContext<Workflow, unknown>) {
    const { toast } = useToast()

    const [workflow, setWorkflow] = useSelectorReducerAtom(
        workflowsMockDataAtom,
        uniqueSelectorReducer<Workflow>(row.id),
    )

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={() => {
                        try {
                            const oldStatus = workflow?.status

                            toast({
                                title: "Workflow deleted",
                                description: `The selected workflow was successfully deleted from the table`,
                                action: (
                                    <ToastAction
                                        altText="Undo action"
                                        onClick={() =>
                                            setWorkflow((item) => ({
                                                ...item,
                                                status: oldStatus ?? "paused",
                                            }))
                                        }
                                    >
                                        Undo
                                    </ToastAction>
                                ),
                            })
                        } catch (e) {
                            console.error(e)
                            toast({
                                variant: "destructive",
                                title: "Uh oh! Something went wrong.",
                                description:
                                    "There was a problem with your request.",
                            })
                        }
                    }}
                    className="bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90"
                >
                    Continue
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}
